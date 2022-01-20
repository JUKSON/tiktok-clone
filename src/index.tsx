import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "context/userContext";
import { DiscardModalProvider } from "context/discardModalContext";
import { SuccessModalProvider } from "context/successModalContext";

ReactDOM.render(
  <ChakraProvider>
    <SuccessModalProvider>
      <DiscardModalProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </DiscardModalProvider>
    </SuccessModalProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
