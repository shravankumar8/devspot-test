// hooks/useModal.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const UseModal = (modalId?: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const MODAL_QUERY_NAME = "selectedModal";
  const [isOpen, setIsOpen] = useState(false);

  // Function to open modal and update URL
  const openModal = () => {
    if (modalId) {
      const currentPath = window.location.pathname;
      const params = new URLSearchParams(searchParams.toString());
      params.set(MODAL_QUERY_NAME, modalId);
      const newUrl = `${currentPath}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    }
    setIsOpen(true);
  };

  // Function to close modal and update URL
  const closeModal = () => {
    const currentPath = window.location.pathname;
    const params = new URLSearchParams(searchParams.toString());
    params.delete(MODAL_QUERY_NAME);
    const query = params.toString();
    const newUrl = query ? `${currentPath}?${query}` : currentPath;
    router.push(newUrl, { scroll: false });
    console.log("closed")
    setIsOpen(false);
  };

  // Check URL on mount and when searchParams change
  useEffect(() => {
    const modalParam = searchParams.get(MODAL_QUERY_NAME);
    if (modalParam === modalId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchParams, modalId]);

  return { isOpen, openModal, closeModal };
};

export default UseModal;
