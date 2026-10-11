import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeStore } from "@/store";
import { renderWithStore } from "@/test/renderWithStore";
import { registerDemoUser } from "./authSlice";
import { ProfileIdentity } from "./ProfileIdentity";

vi.mock("next/link", () => ({ default: "a" }));

describe("ProfileIdentity", () => {
  it("offers optional registration when no demo user exists", () => {
    renderWithStore(<ProfileIdentity />);
    expect(
      screen.getByRole("link", { name: "Register demo profile" }),
    ).toHaveAttribute("href", "/register");
  });

  it("shows the identity and logs out", async () => {
    const user = userEvent.setup();
    const store = makeStore();
    store.dispatch(
      registerDemoUser({ id: "1", name: "Ada", email: "ada@example.com" }),
    );
    renderWithStore(<ProfileIdentity />, { store });

    expect(screen.getByText("Ada")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(store.getState().auth.user).toBeNull();
  });
});
