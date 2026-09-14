"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getToken() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    throw new Error("User not found");
  }

  const provider = "github";

  const client = await clerkClient();

  const clerkResponse = await client.users.getUserOauthAccessToken(
    userId,
    provider
  );

  const accessToken = clerkResponse.data[0];

  if (!accessToken?.token) {
    throw new Error(
      "GitHub access token not found. Please connect your GitHub account."
    );
  }

  return {
    token: accessToken.token,
  };
}