import React from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem = ({ question, answer, isOpen, toggleOpen }: FAQItemProps) => {
  const renderAnswer = (text: string) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4E52F5] hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="border border-white rounded-[12px] mb-3 overflow-hidden">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full px-4 py-3 text-left text-white text-sm sm:text-base font-roboto"
      >
        <span>{question}</span>
        <ChevronDown
          size={20}
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-white/80 text-sm border-t border-white/20 font-roboto">
          {renderAnswer(answer)}
        </div>
      )}
    </div>
  );
};

interface AccordionFAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const AccordionFAQ = ({ faqs }: AccordionFAQProps) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          toggleOpen={() => toggleFAQ(index)}
        />
      ))}
    </div>
  );
};

export default AccordionFAQ;
