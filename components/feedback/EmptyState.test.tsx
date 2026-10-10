import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("announces its title and explanation", () => {
    render(
      <EmptyState title="No photos found" description="Try again later." />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No photos found");
    expect(screen.getByRole("status")).toHaveTextContent("Try again later.");
  });
});
