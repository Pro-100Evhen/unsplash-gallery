import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getSearchNavigationDelay,
  SEARCH_DEBOUNCE_MS,
  SEARCH_THROTTLE_MS,
  SearchForm,
} from "./SearchForm";

const { navigationState, replaceMock } = vi.hoisted(() => ({
  navigationState: { searchParams: new URLSearchParams() },
  replaceMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => navigationState.searchParams,
}));

describe("SearchForm", () => {
  beforeEach(() => {
    navigationState.searchParams = new URLSearchParams();
    replaceMock.mockReset();
  });

  it.each(["", "   "])(
    "shows an accessible error and does not navigate for %j",
    async (query) => {
      const user = userEvent.setup();
      render(<SearchForm />);
      const input = screen.getByRole("searchbox", { name: "Search photos" });

      if (query) {
        await user.type(input, query);
      }
      await user.click(screen.getByRole("button", { name: "Search" }));

      expect(await screen.findByText("Enter a search term.")).toBeVisible();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription("Enter a search term.");
      expect(replaceMock).not.toHaveBeenCalled();
    },
  );

  it("trims and submits a valid query with the button", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search photos" }),
      "  mountain lake  ",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/?query=mountain+lake");
    });
  });

  it("submits the same URL with Enter", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const input = screen.getByRole("searchbox", { name: "Search photos" });

    await user.type(input, "ocean{Enter}");

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/?query=ocean");
    });
  });

  it("debounces input and navigates once with the latest query", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search photos" }),
      "forest",
    );

    expect(replaceMock).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(replaceMock).toHaveBeenCalledOnce();
        expect(replaceMock).toHaveBeenCalledWith("/?query=forest");
      },
      { timeout: 1000 },
    );

    expect(
      screen.getByRole("progressbar", { name: "Loading search results" }),
    ).toBeVisible();
  });

  it("throttles searches that follow a recent navigation", () => {
    expect(getSearchNavigationDelay(1_000, 1_250)).toBe(750);
    expect(getSearchNavigationDelay(1_000, 2_000)).toBe(SEARCH_DEBOUNCE_MS);
    expect(SEARCH_THROTTLE_MS).toBe(1_000);
  });

  it("keeps a cleared input empty when the previous search finishes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchForm />);
    const input = screen.getByRole("searchbox", { name: "Search photos" });

    await user.type(input, "forest");
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/?query=forest");
    });

    await user.clear(input);
    navigationState.searchParams = new URLSearchParams({ query: "forest" });
    rerender(<SearchForm />);

    expect(input).toHaveValue("");
    await waitFor(
      () => {
        expect(replaceMock).toHaveBeenLastCalledWith("/");
      },
      { timeout: 1_500 },
    );
  });

  it("blocks repeated submission while navigation starts", async () => {
    render(<SearchForm initialQuery="forest" />);
    const form = screen.getByRole("search", { name: "Photo search" });

    fireEvent.submit(form);
    fireEvent.submit(form);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledOnce();
    });
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  });
});
