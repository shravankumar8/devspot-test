import { useFormikContext } from "formik";
import { memo, useCallback, useEffect } from "react";
import DateTimeField from "./dateTimeField";
import EventTypeSelector from "./eventTypeSelector";
import { HackathonFormData } from "./types";

export const FormikEventTypeSelector = memo(() => {
  const { values, setFieldValue } = useFormikContext<HackathonFormData>();

  const handleChange = useCallback(
    (type: "virtual" | "physical") => {
      setFieldValue("eventType", type);
    },
    [setFieldValue]
  );

  return (
    <EventTypeSelector eventType={values.eventType} onChange={handleChange} />
  );
});

FormikEventTypeSelector.displayName = "FormikEventTypeSelector";

interface FormikDateTimeFieldProps {
  fieldName: keyof Pick<
    HackathonFormData,
    | "hackathonStart"
    | "hackathonEnd"
    | "registrationStart"
    | "registrationEnd"
    | "submissionStart"
    | "submissionEnd"
    | "winnerAnnouncement"
  >;
  label: string;
  description?: string;
  hasCountdownToggle?: boolean;
  countdownFieldName?: keyof Pick<
    HackathonFormData,
    "showSubmissionCountdown" | "showDeadlineCountdown"
  >;
}

export const FormikDateTimeField = memo<FormikDateTimeFieldProps>(
  ({
    fieldName,
    label,
    description,
    hasCountdownToggle = false,
    countdownFieldName,
  }) => {
    const { values, setFieldValue, errors } =
      useFormikContext<HackathonFormData>();

    useEffect(() => {
      console.log({ errors });
    }, [errors]);

    const handleDateChange = useCallback(
      (date: Date | undefined) => {
        setFieldValue(`${fieldName}.date`, date);
      },
      [setFieldValue, fieldName]
    );

    const handleTimeChange = useCallback(
      (time: string) => {
        setFieldValue(`${fieldName}.time`, time);
      },
      [setFieldValue, fieldName]
    );

    const handleCountdownChange = useCallback(
      (show: boolean) => {
        if (countdownFieldName) {
          setFieldValue(countdownFieldName, show);
        }
      },
      [setFieldValue, countdownFieldName]
    );

    const getErrorName = () => {
      if (Array.isArray(errors)) {
        return errors?.find((item) => item.field === fieldName)?.message;
      }

      return errors?.[fieldName];
    };
    return (
      <DateTimeField
        label={label}
        description={description}
        dateTime={values[fieldName]}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        showCountdown={
          countdownFieldName ? values[countdownFieldName] : undefined
        }
        onCountdownChange={
          hasCountdownToggle ? handleCountdownChange : undefined
        }
        error={getErrorName() as string}
        hasCountdownToggle={hasCountdownToggle}
      />
    );
  }
);

FormikDateTimeField.displayName = "FormikDateTimeField";
