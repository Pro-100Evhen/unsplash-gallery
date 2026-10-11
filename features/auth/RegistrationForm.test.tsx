import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithStore } from "@/test/renderWithStore";
import { RegistrationForm } from "./RegistrationForm";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("RegistrationForm", () => {
  beforeEach(() => {
    push.mockReset();
    vi.stubGlobal("crypto", { randomUUID: () => "user-1" });
  });

  it("validates on blur and focuses the first invalid field on submit", async () => {
    const user = userEvent.setup();
    renderWithStore(<RegistrationForm />);

    const name = screen.getByLabelText("Full name");
    await user.click(name);
    await user.tab();
    expect(
      await screen.findByText("Enter at least 2 characters"),
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Create demo profile" }),
    );
    await waitFor(() => expect(name).toHaveFocus());
  });

  it("toggles password visibility without submitting", async () => {
    const user = userEvent.setup();
    renderWithStore(<RegistrationForm />);
    const password = screen.getByLabelText("Password");

    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(push).not.toHaveBeenCalled();
  });

  it("shows a password mismatch next to the confirmation field", async () => {
    const user = userEvent.setup();
    renderWithStore(<RegistrationForm />);

    await user.type(screen.getByLabelText("Password"), "password1");
    await user.type(screen.getByLabelText("Confirm password"), "password2");
    await user.tab();

    expect(await screen.findByText("Passwords do not match")).toBeVisible();
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("registers only safe user fields and navigates to the profile", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<RegistrationForm />);

    await user.type(screen.getByLabelText("Full name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.type(screen.getByLabelText("Confirm password"), "password1");
    await user.click(screen.getByRole("checkbox"));
    await user.click(
      screen.getByRole("button", { name: "Create demo profile" }),
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/profile"));
    expect(store.getState().auth.user).toEqual({
      id: "user-1",
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
    expect(JSON.stringify(store.getState())).not.toContain("password1");
  });

  it("associates the terms validation message with the checkbox", async () => {
    const user = userEvent.setup();
    renderWithStore(<RegistrationForm />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(
      screen.getByRole("button", { name: "Create demo profile" }),
    );

    const error = await screen.findByText("Accept the terms to continue");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("aria-describedby", error.id);
  });
});
