import { ExternalLink } from "lucide-react";
import React from "react";

const RepoDemo = () => {
  return (
    <div className="flex gap-2 bg-secondary-bg px-5 py-4 rounded-xl">
      <div className="flex flex-1 justify-center items-center gap-2 bg-primary-bg hover:bg-primary-bg/50 px-5 py-1.5 border border-main-primary rounded-lg w-full transition-all delay-75 hover:cursor-pointer">
        <h3 className="font-semibold text-white text-lg">Repo</h3>
        <ExternalLink size={24} className="stroke-main-primary" />
      </div>

      <div className="flex flex-1 justify-center items-center gap-2 bg-primary-bg hover:bg-primary-bg/50 px-5 py-1.5 border border-main-primary rounded-lg w-full transition-all delay-75 hover:cursor-pointer">
        <h3 className="font-semibold text-white text-lg">Demo</h3>
        <ExternalLink size={24} className="stroke-main-primary" />
      </div>
    </div>
  );
};

export default RepoDemo;
