import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageContainer } from "@/components/layout/PageContainer";

describe("PageContainer", () => {
  it("renders its children inside the container", () => {
    render(<PageContainer>Gallery content</PageContainer>);

    expect(screen.getByText("Gallery content")).toBeInTheDocument();
  });
});
