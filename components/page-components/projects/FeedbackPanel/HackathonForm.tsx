import { TextArea } from "@/components/common/form/textarea";
import { RatingButtons } from "./RatingButtons";

export interface HackathonFeedbackData {
  hackathon_id: number;
  question1_rating: number | null;
  question2_rating: number | null;
  question3_rating: number | null;
  question4_rating: number | null;
  comments: string | null;
}

const questions = [
  "Overall experience for this hackathon",
  "Would you recommend this hackathon to a friend?",
  "Overall experience with DevSpot",
  "Would you recommend DevSpot to a friend?",
];

interface HackathonFormProps {
  values: HackathonFeedbackData;

  setFieldValue: (field: string, value: any) => void;
}

export function HackathonForm({
  values,

  setFieldValue,
}: HackathonFormProps) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <RatingButtons
          key={i}
          value={(values as any)[`question${i + 1}_rating`]}
          onChange={(n) =>
            setFieldValue(`hackathonFeedback.question${i + 1}_rating`, n)
          }
          label={q}
        />
      ))}

      <div className="flex flex-col gap-2">
        <h3 className="text-white text-xs font-medium">Comments</h3>
        <TextArea
          name="hackathonFeedback.comments"
          value={values.comments || ""}
          onChange={(e) =>
            setFieldValue("hackathonFeedback.comments", e.target.value)
          }
          className="h-[80px] !bg-[#f7f7ff] border-0 rounded-xl py-3 px-5 text-[#7c42ff] text-xs resize-none focus:ring-2 focus:ring-white/30"
          placeholder="Any other feedback you might have...."
          showMaxLength={false}
        />
      </div>
    </div>
  );
}
