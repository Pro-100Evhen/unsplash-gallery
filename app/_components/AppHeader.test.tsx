import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "./AppHeader";

vi.mock("next/link", () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a data-next-link="true" {...props} />
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("AppHeader", () => {
  it("renders distinct home and search landmarks", () => {
    render(<AppHeader />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Photo Gallery home" }),
    ).toHaveAttribute("href", "/");
    const collectionLink = screen.getByRole("link", { name: /Collection/ });
    expect(collectionLink).toHaveAttribute("href", "/profile");
    expect(collectionLink).toHaveAttribute("data-next-link", "true");
    expect(
      screen.getByRole("search", { name: "Photo search" }),
    ).toBeInTheDocument();
  });

  it("forwards the initial query to the search form", () => {
    render(<AppHeader initialQuery="desert" />);

    expect(
      screen.getByRole("searchbox", { name: "Search photos" }),
    ).toHaveValue("desert");
  });
});
