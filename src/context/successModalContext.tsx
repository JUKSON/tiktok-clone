import React, { createContext, useContext, useState } from "react";

interface SuccessModalContextState {
  isSuccessOpen: boolean;
  openSuccessModal: () => void;
  closeSuccessModal: () => void;
}

const SuccessModalContext = createContext({} as SuccessModalContextState);

export function SuccessModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuccessOpen, setSuccessOpen] = useState(false);

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  function closeSuccessModal() {
    setSuccessOpen(false);
  }

  return (
    <SuccessModalContext.Provider
      value={{
        isSuccessOpen,
        openSuccessModal,
        closeSuccessModal,
      }}
    >
      {children}
    </SuccessModalContext.Provider>
  );
}

export default function useSuccessModal() {
  return useContext(SuccessModalContext);
}
