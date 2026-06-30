import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import store from "./store/index";
import theme from "./theme/index";
import AuthProvider from "./auth/AuthProvider";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ChakraProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
