import { ClerkLoaded } from "@clerk/nextjs";

import { Pricing } from "@/components/home/Pricing";
import Footer from "@/components/global/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";

const Home = async () => {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
      {/* pricing */}
      <ClerkLoaded>
        <Pricing />
      </ClerkLoaded>
      <Footer />
    </div>
  );
};

export default Home;
