"use client";

import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import { Button } from "@mui/material";
import Link from "next/link";

export function AppHeaderCollectionLink() {
  return (
    <Button
      component={Link}
      href="/profile"
      size="small"
      startIcon={<CollectionsBookmarkOutlinedIcon />}
    >
      Collection
    </Button>
  );
}
