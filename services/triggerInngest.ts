"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@clerk/nextjs/server";
import { getToken } from "./getToken";

export const triggerInngest = async ({
  filePath,
  repoFullName,
  owner,
  hasProPlan,
  repo,
  sha,
}: {
  repoFullName: string;
  filePath: string;
  owner: string;
  hasProPlan: boolean;
  repo: string;
  sha: string;
}) => {
  const user = await auth();

  if (!user.isAuthenticated) {
    throw new Error("Unauthenticated");
  }

  try {
    const accessToken = await getToken();

    if (!accessToken.token) {
      throw new Error("GitHub access token not found");
    }

    await inngest.send({
      name: "code.sight.ai/review",
      data: {
        repoFullName,
        filePath,
        owner,
        hasProPlan,
        repo,
        sha,
        token: accessToken.token,
        clerkId: user.userId,
      },
    });
  } catch (error) {
    console.error("Error triggering Inngest function:", error);
    throw error;
  }
};