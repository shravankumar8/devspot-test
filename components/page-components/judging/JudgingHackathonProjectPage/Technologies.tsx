import { Badge } from "@/components/ui/badge";
import React from "react";

const Technologies = () => {
  return (
    <div className="flex flex-col bg-secondary-bg px-5 py-4 rounded-xl">
      <h5 className="font-semibold text-base">Technologies</h5>
      <div className="flex gap-3 mt-3">
        <Badge variant={"secondary"}>React.js</Badge>
        <Badge variant={"secondary"}>Solidity</Badge>
        <Badge variant={"secondary"}>Figma</Badge>
      </div>
    </div>
  );
};

export default Technologies;
