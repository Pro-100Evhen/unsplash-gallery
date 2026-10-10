import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RouteErrorState } from "./RouteErrorState";

describe("RouteErrorState", () => {
  it("renders route-specific copy and invokes retry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <RouteErrorState
        title="Could not load photos"
        description="Check your connection."
        onRetry={onRetry}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("Check your connection.")).toBeVisible();
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
