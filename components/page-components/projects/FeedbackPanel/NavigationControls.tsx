import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (values?: any) => void;
  submitting: boolean;
  disableNext: boolean;
}

export function NavigationControls({
  currentStep,
  totalSteps,
  isLast,
  onPrevious,
  onNext,
  onSubmit,
  submitting,
  disableNext,
}: NavigationControlsProps) {
  return (
    <div className="flex items-end justify-between mt-4">
      <div className="bg-[#000375] text-white px-2 py-0.5 rounded-lg text-sm font-medium">
        {currentStep + 1}
        <span className="text-[#A076FF]">/{totalSteps}</span>
      </div>

      <div className="flex items-center gap-2">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
            className="!px-4 !py-1 text-base"
          >
            Back
          </Button>
        )}

        <Button
          type='button'
          onClick={isLast ? onSubmit : onNext}
          disabled={submitting || disableNext}
          className="!bg-[#000375] hover:bg-[#000375]/90 text-white !px-4 !py-1 rounded-lg text-base font-semibold flex gap-2 items-center disabled:opacity-50"
        >
          {submitting && <Spinner size="tiny" />}
          {isLast ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
