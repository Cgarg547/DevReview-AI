"use server";

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const reviewCode = async (
  code: string,
  fileName: string
): Promise<string> => {
  const prompt = `
    You are an expert senior software engineer and an exceptional code reviewer.
    Analyze the following code from the file \`${fileName}\`.

    Provide a comprehensive review focusing on the following aspects:
    1.  **Potential Bugs**: Identify any logical errors, race conditions, or edge cases that could lead to bugs.
    2.  **Performance Issues**: Suggest optimizations for any inefficient code, memory leaks, or unnecessary computations.
    3.  **Best Practices & Readability**: Comment on code style, naming conventions, and overall readability. Suggest improvements based on established best practices for the language/framework.
    4.  **Security Vulnerabilities**: Point out any potential security risks (e.g., XSS, injection vulnerabilities, improper error handling), if applicable.
    5.  **Maintainability & Scalability**: Assess how easy the code is to modify, extend, and maintain. Suggest ways to improve its structure.

    Structure your review using Markdown. Use clear headings for each section.
    For each point, provide a brief explanation and a concrete code suggestion if possible.
    If no issues are found in a particular category, state that clearly.
    Be constructive and professional in your feedback.

    Here is the code:
    \`\`\`
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No response from Gemini API.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};
