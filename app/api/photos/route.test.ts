import { beforeEach, describe, expect, it, vi } from "vitest";

const { listPhotosMock, searchPhotosMock } = vi.hoisted(() => ({
  listPhotosMock: vi.fn(),
  searchPhotosMock: vi.fn(),
}));

vi.mock("@/lib/unsplash/client", () => ({
  listPhotos: listPhotosMock,
  searchPhotos: searchPhotosMock,
}));

import { GET } from "./route";

const response = {
  items: [],
  page: 2,
  perPage: 20,
  total: 40,
  totalPages: 2,
};

describe("GET /api/photos", () => {
  beforeEach(() => {
    listPhotosMock.mockReset();
    searchPhotosMock.mockReset();
  });

  it("returns the requested discovery page", async () => {
    listPhotosMock.mockResolvedValue(response);

    const result = await GET(new Request("http://localhost/api/photos?page=2"));

    expect(result.status).toBe(200);
    expect(await result.json()).toEqual(response);
    expect(listPhotosMock).toHaveBeenCalledWith(2);
  });

  it("returns the requested search page", async () => {
    searchPhotosMock.mockResolvedValue(response);

    const result = await GET(
      new Request("http://localhost/api/photos?page=2&query=forest"),
    );

    expect(result.status).toBe(200);
    expect(searchPhotosMock).toHaveBeenCalledWith("forest", 2);
    expect(listPhotosMock).not.toHaveBeenCalled();
  });

  it.each(["0", "1", "invalid"])(
    "rejects invalid next-page value %s",
    async (page) => {
      const result = await GET(
        new Request(`http://localhost/api/photos?page=${page}`),
      );

      expect(result.status).toBe(400);
      expect(await result.json()).toEqual({
        error: {
          code: "INVALID_PAGINATION",
          message: "Invalid photo pagination parameters.",
        },
      });
    },
  );
});
