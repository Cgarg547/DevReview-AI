import { BrainIcon } from "@/icons/BrainIcon";
import { CheckIcon } from "@/icons/CheckIcon";
import { GitHubIcon } from "@/icons/GitHubIcon";

const FeatureCard = ({
  Icon,
  description,
  title,
}: {
  Icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700 shadow-lg">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-900/50 mx-auto mb-6">
        {Icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why CodeSight AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <FeatureCard
            description="Go beyond linting. Get deep insights into potential bugs, performance bottlenecks, and security vulnerabilities."
            title="AI-Powered Analysis"
            Icon={<BrainIcon className="w-8 h-8 text-sky-400" />}
          />
          {/* Feature 2 */}
          <FeatureCard
            description="Simply paste your public GitHub repository URL and start exploring. No complex setup required."
            title="Seamless GitHub Integration"
            Icon={<GitHubIcon className="w-8 h-8 text-sky-400" />}
          />

          {/* Feature 3 */}
          <FeatureCard
            description="Receive clear, constructive feedback in plain English, with concrete code suggestions to improve quality."
            title="Actionable Feedback"
            Icon={<CheckIcon className="w-8 h-8 text-sky-400" />}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
