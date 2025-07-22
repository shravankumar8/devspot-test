import { TextArea } from "@/components/common/form/textarea";
import { RatingButtons } from "./RatingButtons";

export interface ChallengeFeedbackData {
  challenge_id: number;
  overall_rating: number | null;
  docs_rating: number | null;
  support_rating: number | null;
  challenge_recommendation_rating:number|null
  comments: string | null;
}

interface ChallengeFormProps {
  index: number;
  values: ChallengeFeedbackData;
  setFieldValue: (field: string, value: any) => void;
}

export function ChallengeForm({
  index,
  values,
  setFieldValue,
}: ChallengeFormProps) {
  return (
    <div className="space-y-3">
      <RatingButtons
        value={values?.overall_rating}
        onChange={(n) =>
          setFieldValue(`challengeFeedbacks.${index}.overall_rating`, n)
        }
        label="Overall experience"
      />

      <RatingButtons
        value={values?.docs_rating}
        onChange={(n) =>
          setFieldValue(`challengeFeedbacks.${index}.docs_rating`, n)
        }
        label="Docs experience"
      />

      <RatingButtons
        value={values?.support_rating}
        onChange={(n) =>
          setFieldValue(`challengeFeedbacks.${index}.support_rating`, n)
        }
        label="Support experience"
      />
      <RatingButtons
        value={values?.challenge_recommendation_rating}
        onChange={(n) =>
          setFieldValue(
            `challengeFeedbacks.${index}.challenge_recommendation_rating`,
            n
          )
        }
        label="Would you recommend this Challenge to a friend?"
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-white text-xs font-medium">Comments</h3>
        <TextArea
          name={`challengeFeedbacks.${index}.comments`}
          value={values?.comments || ""}
          onChange={(e) =>
            setFieldValue(
              `challengeFeedbacks.${index}.comments`,
              e.target.value
            )
          }
          className="h-[80px] !bg-[#f7f7ff] border-0 rounded-xl py-3 px-5 text-[#7c42ff] text-xs resize-none focus:ring-2 focus:ring-white/30"
          placeholder="Any other feedback you might have...."
          showMaxLength={false}
        />
      </div>
    </div>
  );
}
