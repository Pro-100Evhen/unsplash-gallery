"use client";

import PhotoLibraryRounded from "@mui/icons-material/PhotoLibraryRounded";
import { Button } from "@mui/material";
import Link from "next/link";
import styles from "./AppHeader.module.scss";

export function AppHeaderBrand() {
  return (
    <Button
      component={Link}
      className={styles.brand}
      href="/"
      aria-label="Photo Gallery home"
      color="inherit"
      startIcon={<PhotoLibraryRounded aria-hidden="true" />}
    >
      Photo Gallery
    </Button>
  );
}
