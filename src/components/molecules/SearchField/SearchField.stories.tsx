import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchField } from "./SearchField";

const meta = {
  title: "Molecules/SearchField",
  component: SearchField,
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "aurora",
    onChange: () => undefined,
    placeholder: "Search by order number or product",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <SearchField
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
};
