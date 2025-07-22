import { TechnologyStatusEnum } from "@/types/entities";
import * as yup from "yup";

export const tag_creation_validation = yup.object({
  tags: yup.array().of(yup.string()).required("Tags are required"),
});

export const update_tag_status_validation = yup.object({
  status: yup
    .mixed<TechnologyStatusEnum>()
    .oneOf(["approved", "rejected"])
    .required("Tag Status is required"),
});
