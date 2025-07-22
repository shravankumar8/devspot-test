import Search from "@/components/icons/Search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HackathonFaqs } from "@/types/entities";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "../../profile/ProfileTabs/EmptyState";
import { EditFAQsModal } from "../editHackathon/faqs";
import FAQSkeleton from "./skeletonLoader";
import { useTechOwnerStore } from "@/state/techOwnerStore";

export const customLinkify = (text: string) => {
  const customLinkRegex = /%\^&(.*?)%\^&(.*?)\$%\^/g;
  return text.replace(customLinkRegex, (match, linkText, linkUrl) => {
    return `<a href="${linkUrl}" target="_blank" class="text-[#FFFFFF] hover:text-[#4E52F5] underline transition-colors duration-200">${linkText}</a>`;
  });
};

export const HackathonFAQs = ({
  isOwner,
  hackathonId,
}: {
  isOwner: boolean;
  hackathonId: string;
}) => {
  const { selectedOrg } = useTechOwnerStore();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<HackathonFaqs[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/hackathons/${hackathonId}/faqs`);
      setFaqs(response.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const expandAll = () => {
    if (openItems.length > 0) {
      setOpenItems([]);
    } else {
      setOpenItems(faqs?.map((_, index) => index));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Automatically expand all when searching
    if (value.trim() !== "") {
      const matchingIndices = faqs
        .map((faq, index) =>
          faq.question.toLowerCase().includes(value.toLowerCase()) ||
          faq.answer.toLowerCase().includes(value.toLowerCase())
            ? index
            : -1
        )
        .filter((index) => index !== -1);
      setOpenItems(matchingIndices);
    } else {
      // Collapse all when search is cleared
      setOpenItems([]);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const isCurrentlyClosed = !prev.includes(index);
      if (isCurrentlyClosed) {
        // Make API call only when opening the FAQ
        axios.patch(`/api/hackathons/${hackathonId}/faqs/${faqs[index].id}`);
        return [...prev, index];
      }
      return prev.filter((item) => item !== index);
    });
  };
  const handleSaveFaqs = async (faqs: any[]) => {
    try {
      await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/faqs`,
        faqs
      );
      toast.success("Faqs updated successfully");
      await fetchFAQs();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to update faq");
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <div>
          <FAQSkeleton />
        </div>
      ) : faqs.length > 0 ? (
        <div className="text-white font-roboto mb-12">
          <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-end">
              <Input
                placeholder="Search FAQ"
                className="h-10"
                prefixIcon={<Search />}
                type="text"
                value={searchTerm}
                onChange={handleSearch}
              />

              <Button
                size="sm"
                variant="secondary"
                onClick={expandAll}
                className="w-[100px]"
              >
                <span className="text-base">
                  {openItems.length > 0 ? "Collapse all" : "Expand all"}
                </span>
              </Button>
            </div>

            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[12px] bg-secondary-bg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-5 py-3 flex justify-between items-center text-left"
                    >
                      <h3 className="text-sm md:text-base font-medium">
                        {item.question}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: openItems.includes(index) ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 " color="#4E52F5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openItems.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-5 pb-3 text-[#B8B8B8] mt-1 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: customLinkify(item.answer),
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#B8B8B8]">
                    No FAQs found matching your search
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No FAQs found"
          description="There's no FAQs added yet for this hackathon"
          buttonLabel="Home"
          href={`/hackathons/${hackathonId}`}
        />
      )}
      {isOwner && faqs && (
        <EditFAQsModal onSave={handleSaveFaqs} initialFaqs={faqs} />
      )}
    </div>
  );
};
