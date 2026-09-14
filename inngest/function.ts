import { createAgent, gemini } from "@inngest/agent-kit";
import { fetchMutation } from "convex/nextjs";

import { inngest } from "./client";
import { inngestFetchFileContent } from "@/services/githubService";
import { api } from "@/convex/_generated/api";
import { NonRetriableError } from "inngest";

export const reviewCode = inngest.createFunction(
  { id: "code-sight-ai" },
  { event: "code.sight.ai/review" },
  async ({ event, step }) => {
    const {
      filePath,
      repoFullName,
      owner,
      hasProPlan,
      repo,
      sha,
      clerkId,
      token,
    } = event.data;

    if (
      !filePath ||
      !repoFullName ||
      !owner ||
      !repo ||
      !sha ||
      !clerkId ||
      !token
    ) {
      throw new NonRetriableError("Missing required event data");
    }

    await step.run("Create Review", async () => {
      const reviewId = await fetchMutation(api.review.saveReview, {
        repoFullName,
        filePath,
        fileSha: sha,
        owner,
        status: "Reviewing your code...",
        clerkId,
        serviceKey: process.env.INNGEST_REVIEW_SECRET,
      });

      return { reviewId };
    });

    const { content } = await step.run("Fetch File", async () => {
      const { content } = await inngestFetchFileContent(
        owner,
        repo,
        filePath,
        token
      );

      return { content };
    });

    const prompt = `
You are an expert senior software engineer and exceptional code reviewer.

Analyze the following source code.

File:
${filePath}

Return ONLY valid JSON.

Do not return Markdown.
Do not use code fences.
Do not add explanations outside the JSON.

Use exactly this structure:

{
  "score": 85,
  "summary": "Short overall assessment of the code.",
  "findings": [
    {
      "severity": "medium",
      "category": "Best Practices",
      "title": "Short issue title",
      "description": "Explain the problem clearly.",
      "line": 23,
      "recommendation": "Explain how to fix the issue.",
      "suggestion": "Optional code example or empty string."
    }
  ]
}

Rules:

- score must be an integer from 0 to 100.
- summary must be concise and useful.
- findings must contain only meaningful issues.
- severity must be exactly one of:
  critical
  high
  medium
  low

- category must be exactly one of:
  Bugs
  Performance
  Best Practices
  Security
  Maintainability

- line should be the most relevant source-code line number.
- Use 0 if there is no specific line.
- recommendation must give a concrete solution.
- suggestion should contain a short improved code example when useful.
- Use an empty string when a code example is not useful.
- Do not invent vulnerabilities or problems.
- Do not create findings simply to fill categories.
- Prioritize real correctness, security, performance and maintainability issues.

Analyze:

1. Potential bugs and edge cases
2. Performance
3. Best practices and readability
4. Security
5. Maintainability and scalability

Source code:

\`\`\`
${content}
\`\`\`
`;

    const reviewCode = createAgent({
      name: "Review Code",
      system:
        "You are an expert senior software engineer and exceptional code reviewer. Always return valid JSON matching the requested schema.",
      model: gemini({
        model: "gemini-3.5-flash-lite",
      }),
    });

    const { output } = await reviewCode.run(prompt);

    const Result = await step.run("Save Result", async () => {
      const rawOutput =
        output[0].type === "text"
          ? output[0].content
          : "";

      if (!rawOutput) {
        throw new Error("AI returned an empty review.");
      }

      let reviewData: {
        score: number;
        summary: string;
        findings: {
          severity: "critical" | "high" | "medium" | "low";
          category: string;
          title: string;
          description: string;
          line: number;
          recommendation: string;
          suggestion: string;
        }[];
      };

      try {
        reviewData = JSON.parse(rawOutput as string);
      } catch (error) {
        console.error("Failed to parse AI review:", error);
        console.error("Raw AI response:", rawOutput);

        throw new Error(
          "AI returned an invalid review format."
        );
      }

      const reviewContent = JSON.stringify(reviewData);

      const reviewId = await fetchMutation(api.review.saveReview, {
        repoFullName,
        filePath,
        fileSha: sha,
        reviewContent,
        owner,
        clerkId,
        status: "Completed",
        serviceKey: process.env.INNGEST_REVIEW_SECRET,
      });

      if (!hasProPlan) {
        await fetchMutation(
          api.users.updateReviewsRemaining,
          {
            clerkId,
          }
        );
      }

      return {
        reviewId,
        reviewContent,
      };
    });

    return Result;
  }
);