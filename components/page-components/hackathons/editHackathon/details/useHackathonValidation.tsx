import { useCallback } from "react";
import { FormValidationError, HackathonFormData } from "./types";
import { combineDateAndTime } from "./utils";

const useHackathonValidation = () => {
  const validateDates = useCallback(
    (data: HackathonFormData): FormValidationError[] => {
      const errors: FormValidationError[] = [];

      const hackStart = new Date(
        combineDateAndTime(data.hackathonStart.date, data.hackathonStart.time)
      );
      const hackEnd = new Date(
        combineDateAndTime(data.hackathonEnd.date, data.hackathonEnd.time)
      );
      const regStart = new Date(
        combineDateAndTime(
          data.registrationStart.date,
          data.registrationStart.time
        )
      );
      const regEnd = new Date(
        combineDateAndTime(data.registrationEnd.date, data.registrationEnd.time)
      );
      const subStart = new Date(
        combineDateAndTime(data.submissionStart.date, data.submissionStart.time)
      );
      const subEnd = new Date(
        combineDateAndTime(data.submissionEnd.date, data.submissionEnd.time)
      );

      // Required field validation
      if (!data.hackathonStart.date) {
        errors.push({
          field: "hackathonStart",
          message: "Hackathon start date is required",
        });
      }

      if (!data.hackathonEnd.date) {
        errors.push({
          field: "hackathonEnd",
          message: "Hackathon start date is required",
        });
      }

      if (!data.registrationStart.date) {
        errors.push({
          field: "registrationStart",
          message: "Registration start date is required",
        });
      }

      if (!data.submissionStart.date) {
        errors.push({
          field: "submissionStart",
          message: "Project submission start date is required",
        });
      }

      if (!data.registrationEnd.date) {
        errors.push({
          field: "registrationEnd",
          message: "Registration end date is required",
        });
      }

      if (!data.submissionEnd.date) {
        errors.push({
          field: "submissionEnd",
          message: "Project submission end date is required",
        });
      }

      // Date logic validation
      if (hackStart >= hackEnd) {
        errors.push({
          field: "hackathonEnd",
          message: "Hackathon end must be after start date",
        });
      }

      if (hackStart >= regStart) {
        errors.push({
          field: "registrationStart",
          message: "Registration Start must be after hackathon start date",
        });
      }

      if (regStart >= regEnd) {
        errors.push({
          field: "registrationEnd",
          message: "Registration end must be after start date",
        });
      }

      if (subStart >= subEnd) {
        errors.push({
          field: "submissionEnd",
          message: "Submission end must be after start date",
        });
      }

      return errors;
    },
    []
  );

  return { validateDates };
};

export default useHackathonValidation;
