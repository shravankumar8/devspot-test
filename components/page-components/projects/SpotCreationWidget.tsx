import { Spinner } from "@/components/ui/spinner";
import { useHackathonStore } from "@/state/hackathon";
import { useProjectStore } from "@/state/project";
import { X } from "lucide-react";

const SpotCreationWidget = () => {
  const { projectCreation, setProjectCreation } = useProjectStore();
  const { selectedHackathon } = useHackathonStore();

  if (!projectCreation) return null;

  return (
    <div className="bg-tertiary-bg border border-secondary-bg rounded-xl flex gap-3 items-start shadow-md py-3 px-2 h-[100px] w-[300px]">
      <Spinner size="medium" className="text-main-primary" />
      <div className="text-xs font-roboto font-medium flex flex-col gap-2">
        <h2 className="text-white ">
          Creating your project for {selectedHackathon?.name}...
        </h2>
        <p className="text-secondary-text ">
          This will take a few minutes. Feel free to leave this page.
        </p>
      </div>

      <X
        className="h-5 w-5 text-[#89898C] cursor-pointer"
        onClick={() => setProjectCreation(null)}
      />
    </div>
  );
};

export default SpotCreationWidget;
