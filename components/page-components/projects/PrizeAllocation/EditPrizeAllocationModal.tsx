import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import {TeamMemberships } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";
import Label from "@/components/common/form/label";
import AllocationCard from "./AllocationCard";
import { useState } from "react";

interface EditProjectPrizeAllocationModalProps {
    id: number;
    members: TeamMemberships[];
}

const EditProjectPrizeAllocationModal = ({ members: teamMembers, id }: EditProjectPrizeAllocationModalProps) => {
    const { mutate } = useSWRConfig();

    const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
    const initialMembers = teamMembers?.filter((member) => member.status == 'confirmed')


    const [members, setMembers] = useState(initialMembers)
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
         const total = members.reduce(
           (sum, m) => sum + (m.prize_allocation ?? 0),
           0
         );

         // 2. if it’s not exactly 100, bail out with an error toast
         if (total !== 100) {
           toast.error(
             `Total prize allocation must add up to 100 (currently ${total})`,
             { position: "top-right" }
           );
           return;
         }
         
        setSubmitting(true);

        try {

            const payload = members.map((item) => {
                return {
                    user_id: item.user_id,
                    prize_allocation: item.prize_allocation
                }
            })

            await axios.patch(`/api/projects/${id}/update-allocation`, payload);


            mutate(`/api/projects/${id}`);

            toast.success("Updated Project Prize Allocation Information Successfully", {
                position: "top-right",
            });

            onClose();
        } catch (error: any) {
            console.log("Error updating Project Prize Allocation information:", error);

            setSubmitting(false);

            if (error instanceof AxiosError) {
                toast.error(
                    `Could not Update Project Prize Allocation Information ${error?.response?.data?.error}`,
                    {
                        position: "top-right",
                    }
                );

                return;
            }

            toast.error(
                `Could not Update Project Prize Allocation Information  ${error?.message}`,
                {
                    position: "top-right",
                }
            );
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <GenericModal
            controls={{
                isOpen,
                onClose,
                onOpen,
            }}
            trigger={
                <div>
                    <EditProfileIcon />
                </div>
            }
        >
            <DialogHeader className="bg-[#1B1B22] py-2">
                <DialogTitle className="!text-[24px] font-semibold">
                    Edit Prize Allocation
                </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-5 md:h-[400px] overflow-y-scroll pb-5">


                <div className="flex w-full flex-col gap-3">
                    <Label>Click and drag the slider’s handle to change your team members’ prize allocation.</Label>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,300px),1fr))] gap-8">
                        {members.map((member) => (
                            <AllocationCard key={member.id} member={member} mode='active' onChange={(value) => {
                                setMembers((prev) =>
                                    prev.map((m) => (m.users.id === member.users.id ? { ...m, prize_allocation: value } : m)),
                                )
                            }}
                            />
                        ))}
                    </div>
                </div>


            </div>

            <div className="w-full flex sm:justify-end justify-center mt-4">
                <Button
                    type="submit"
                    className="w-fit font-roboto text-sm gap-2"
                    onClick={handleSubmit}
                    disabled={submitting}                    >
                    {submitting && <Spinner size="small" />} Save
                </Button>
            </div>
        </GenericModal>
    );
};

export default EditProjectPrizeAllocationModal;
