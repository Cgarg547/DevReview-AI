import { Dashboard } from "@/components/dashboard/Dashboard";
import { Spinner } from "@/components/global/Spinner";
import { fetchUserRepos } from "@/services/githubService";

const DashboardPage = async () => {
  const repoData = await fetchUserRepos();
  // console.log("User Repos:", repoData);
  if (repoData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return <Dashboard repos={repoData} />;
};

export default DashboardPage;
