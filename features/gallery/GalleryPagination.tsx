"use client";

import { Box, Pagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { MAX_GALLERY_PAGE } from "./pagination";

type GalleryPaginationProps = Readonly<{
  page: number;
  totalPages: number;
}>;

export function GalleryPagination({
  page,
  totalPages,
}: GalleryPaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const count = Math.min(Math.max(1, totalPages), MAX_GALLERY_PAGE);
  const currentPage = Math.min(Math.max(1, page), count);

  const changePage = (_event: React.ChangeEvent<unknown>, nextPage: number) => {
    if (nextPage < 1 || nextPage > count || nextPage === currentPage) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", String(nextPage));

    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      component="nav"
      aria-label="Photo gallery pagination"
      aria-busy={isPending}
      sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 6 } }}
    >
      <Pagination
        page={currentPage}
        count={count}
        onChange={changePage}
        disabled={isPending}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        getItemAriaLabel={(type, itemPage, selected) => {
          if (type === "page") {
            return selected ? `Page ${itemPage}` : `Go to page ${itemPage}`;
          }

          return `Go to ${type} page`;
        }}
      />
    </Box>
  );
}
