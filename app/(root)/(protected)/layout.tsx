import Footer from "@/components/global/Footer";
import Header from "@/components/navigation/Header";
import { resetUserReviews } from "@/services/resetUserReviews";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await auth();

  if (!user.isAuthenticated) {
    redirect("/sign-in");
  }

  if (user) {
    await resetUserReviews({ userId: user.userId });
  }
  return (
    <div className="flex flex-col min-h-[calc(100vh)] space-y-10">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
