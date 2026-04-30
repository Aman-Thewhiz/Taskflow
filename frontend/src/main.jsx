import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "./chakra";
import { Provider } from "react-redux";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./chakra";
import theme from "./theme";
import store from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider value={theme}>
        <Toaster />
        <App />
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
