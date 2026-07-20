import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePagination(args: ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.page);
  return <Pagination {...args} page={page} onPageChange={setPage} />;
}

export const Interactive: Story = {
  args: {
    page: 2,
    pageSize: 4,
    total: 12,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};
