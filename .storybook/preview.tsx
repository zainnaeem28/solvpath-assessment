import type { Preview } from "@storybook/react-vite";
import "@/styles/brand-tokens.css";
import "@/styles/global.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
