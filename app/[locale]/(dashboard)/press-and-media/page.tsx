import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";

const PressAndMedia = () => {
  return (
    <div className=" relative">
      <div className="">
        <div className="dark">
          <div className="container mx-auto px-4 py-10 flex h-full justify-center items-center w-full md:flex-row">
            <div className="md:w-3/4 lg:w-[60%] mt-5 md:mt-0">
              <h1 className="text-[32px] font-semibold mb-10">Press & Media</h1>

              {/* Section 1: Acceptance of Terms */}
              <div className="pb-5 font-roboto text-sm flex gap-2 items-center">
                <p className="text-secondary-text">Coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PressAndMedia;
