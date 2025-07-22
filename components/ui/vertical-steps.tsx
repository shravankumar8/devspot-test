export type Step = {
  index: number;
  link: string;
  current: boolean;
  completed: boolean;
};

type Props = {
  steps: Step[];
};

const CurrentStep: React.FC<Step> = ({ index }) => {
  return (
    <li className="w-full flex justify-center dark:bg-dark-stepper border-l border-l-indigo-400 bg-light-stepper">
      <span className="rounded-full cursor-pointer dark:bg-indigo-600 p-2 h-10 w-10 flex justify-center items-center  shadow-sm dark:hover:bg-indigo-500 border border-slate-300/50">
        {index + 1}
      </span>
    </li>
  );
};

const Completed: React.FC<Step> = ({ index }) => {
  return (
    <li className="w-full flex justify-center ">
      <span className="bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 rounded-full dark:bg-indigo-600 p-2 h-10 w-10 flex justify-center items-center  shadow-sm dark:hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:focus-visible:outline-indigo-600">
        {index + 1}
      </span>
    </li>
  );
};

const Next: React.FC<Step> = ({ index }) => {
  return (
    <li className="w-full flex justify-center ">
      <span className="rounded-full  p-2 h-10 w-10 flex justify-center items-center  shadow-sm border border-slate-300/50 dark:border-white/20">
        {index + 1}
      </span>
    </li>
  );
};

export const VerticalSteps: React.FC<Props> = ({ steps }) => {
  return (
    <ul className="dark:bg-slate-400 flex-grow w-20 border-r border-slate-100/10 dark:border-blue-400/10 flex flex-col justify-center items-center space-y-12">
      {steps.map((step) => {
        if (step.current) {
          return <CurrentStep key={step.index} {...step} />;
        }

        if (step.completed) {
          return <Completed key={step.index} {...step} />;
        } else {
          return <Next {...step} key={step.index} />;
        }
      })}
    </ul>
  );
};
