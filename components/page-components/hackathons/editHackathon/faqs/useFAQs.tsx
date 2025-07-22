import { useFormik } from "formik";
import * as Yup from "yup";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQsFormValues {
  faqs: FAQItem[];
}

export const useFAQsForm = (initialFAQs: FAQItem[] = []) => {
  const initialValues: FAQsFormValues = {
    faqs:
      initialFAQs.length > 0
        ? initialFAQs
        : [{ id: 1, question: "", answer: "" }],
  };

  const validationSchema = Yup.object().shape({
    faqs: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        answer: Yup.string().required("Answer is required"),
      })
    ),
  });

  const formik = useFormik<FAQsFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Filter out empty FAQs if needed
        const nonEmptyFAQs = values.faqs.filter(
          (faq) => faq.question.trim() && faq.answer.trim()
        );
        return nonEmptyFAQs;
      } catch (error) {
        console.error("Error submitting FAQs:", error);
        return false;
      }
    },
    enableReinitialize: true,
  });

  const addFAQ = () => {
    const newId =
      formik.values.faqs.length > 0
        ? Math.max(...formik.values.faqs.map((f) => f.id)) + 1
        : 1;
    formik.setFieldValue("faqs", [
      ...formik.values.faqs,
      { id: newId, question: "", answer: "" },
    ]);
  };

  const removeFAQ = (id: number) => {
    formik.setFieldValue(
      "faqs",
      formik.values.faqs.filter((faq) => faq.id !== id)
    );
  };

  const updateFAQ = (id: number, field: keyof FAQItem, value: string) => {
    const updatedFAQs = formik.values.faqs.map((faq) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    formik.setFieldValue("faqs", updatedFAQs);
  };

  return {
    formik,
    addFAQ,
    removeFAQ,
    updateFAQ,
  };
};
