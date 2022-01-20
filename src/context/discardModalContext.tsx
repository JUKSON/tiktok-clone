import React, { createContext, useContext, useState } from "react";

interface DiscardModalContextState {
  isDiscardOpen: boolean;
  openDiscardModal: () => void;
  closeDiscardModal: () => void;
}

const DiscardModalContext = createContext({} as DiscardModalContextState);

export function DiscardModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDiscardOpen, setDiscardOpen] = useState(false);

  function openDiscardModal() {
    setDiscardOpen(true);
  }

  function closeDiscardModal() {
    setDiscardOpen(false);
  }

  return (
    <DiscardModalContext.Provider
      value={{
        isDiscardOpen,
        openDiscardModal,
        closeDiscardModal,
      }}
    >
      {children}
    </DiscardModalContext.Provider>
  );
}

export default function useDiscardModal() {
  return useContext(DiscardModalContext);
}
