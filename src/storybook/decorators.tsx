import type { Decorator } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

/** Wrap stories that need React Router (`Link`, `useNavigate`, etc.). */
export function withRouter(initialEntries: string[] = ["/"]): Decorator {
  return (Story) => (
    <MemoryRouter initialEntries={initialEntries}>
      <Story />
    </MemoryRouter>
  );
}

/** Ensure auth is signed out before rendering (LoginForm / AppHeader). */
export const withSignedOut: Decorator = (Story) => {
  useAuthStore.setState({ user: null, loginError: null });
  return <Story />;
};

/** Signed-in Maya Chen session for header/account stories. */
export const withSignedIn: Decorator = (Story) => {
  useAuthStore.setState({
    user: {
      id: "acct_maya",
      name: "Maya Chen",
      email: "maya.chen@example.com",
    },
    loginError: null,
  });
  return <Story />;
};
