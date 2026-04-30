import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const colors = {
  brand: {
    50: { value: "#e6fff6" },
    100: { value: "#c8fce8" },
    200: { value: "#95f4d1" },
    300: { value: "#5de7b7" },
    400: { value: "#38d9a1" },
    500: { value: "#22c28a" },
    600: { value: "#159b6d" },
    700: { value: "#0f7452" },
    800: { value: "#0d5440" },
    900: { value: "#0a3b2e" },
  },
  slate: {
    900: { value: "#0b0f14" },
    850: { value: "#0f141b" },
    800: { value: "#141a23" },
    700: { value: "#1b2431" },
    600: { value: "#263243" },
  },
  amber: {
    400: { value: "#f6c453" },
    500: { value: "#f0b132" },
  },
};

const appConfig = defineConfig({
  globalCss: {
    body: {
      bg: "slate.900",
      color: "whiteAlpha.900",
      backgroundImage:
        "radial-gradient(900px circle at 20% 10%, rgba(34, 194, 138, 0.18), transparent 40%), radial-gradient(700px circle at 80% 20%, rgba(246, 196, 83, 0.12), transparent 45%)",
      backgroundAttachment: "fixed",
    },
  },
  theme: {
    tokens: {
      colors,
      fonts: {
        heading: { value: '"Plus Jakarta Sans", system-ui, sans-serif' },
        body: { value: '"Plus Jakarta Sans", system-ui, sans-serif' },
      },
    },
  },
});

const theme = createSystem(defaultConfig, appConfig);

export default theme;
