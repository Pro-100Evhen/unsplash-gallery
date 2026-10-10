import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GalleryPagination } from "./GalleryPagination";
import { MAX_GALLERY_PAGE } from "./pagination";

const { navigationState, pushMock } = vi.hoisted(() => ({
  navigationState: {
    pathname: "/search",
    searchParams: new URLSearchParams("query=forest&page=2&color=green"),
  },
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => navigationState.searchParams,
}));

describe("GalleryPagination", () => {
  beforeEach(() => {
    pushMock.mockReset();
    navigationState.pathname = "/search";
    navigationState.searchParams = new URLSearchParams(
      "query=forest&page=2&color=green",
    );
  });

  it("updates only page and preserves the pathname and other params", async () => {
    const user = userEvent.setup();
    render(<GalleryPagination page={2} totalPages={5} />);

    await user.click(screen.getByRole("button", { name: "Go to page 3" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/search?query=forest&page=3&color=green",
    );
  });

  it("supports keyboard navigation and does not expose pages past boundaries", async () => {
    const user = userEvent.setup();
    render(<GalleryPagination page={1} totalPages={2} />);

    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Go to page 3" }),
    ).not.toBeInTheDocument();

    screen.getByRole("button", { name: "Go to page 2" }).focus();
    await user.keyboard("{Enter}");

    expect(pushMock).toHaveBeenCalledWith(
      "/search?query=forest&page=2&color=green",
    );
  });

  it("does not expose pages beyond the application limit", () => {
    render(
      <GalleryPagination
        page={MAX_GALLERY_PAGE}
        totalPages={MAX_GALLERY_PAGE + 100}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Go to last page" }),
    ).toBeDisabled();
  });
});
