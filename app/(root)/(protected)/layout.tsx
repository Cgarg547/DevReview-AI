import Footer from "@/components/global/Footer";
import Header from "@/components/navigation/Header";
import { resetUserReviews } from "@/services/resetUserReviews";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await auth();

  if (!user.isAuthenticated) {
    redirect("/sign-in");
  }

  if (user.userId) {
    await resetUserReviews({ userId: user.userId });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <Header />

      <main className="min-w-0 flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default ProtectedLayout;
