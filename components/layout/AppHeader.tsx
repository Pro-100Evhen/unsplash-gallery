"use client";

import PhotoLibraryRounded from "@mui/icons-material/PhotoLibraryRounded";
import { AppBar, Button, Toolbar } from "@mui/material";
import Link from "next/link";
import { Suspense } from "react";
import { SearchForm } from "@/features/search/SearchForm";
import { PageContainer } from "./PageContainer";
import styles from "./AppHeader.module.scss";

type AppHeaderProps = Readonly<{
  initialQuery?: string;
}>;

export function AppHeader({ initialQuery = "" }: AppHeaderProps) {
  return (
    <AppBar
      component="header"
      position="sticky"
      color="inherit"
      elevation={0}
      className={styles.header}
    >
      <PageContainer>
        <Toolbar disableGutters className={styles.toolbar}>
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
          <div className={styles.search}>
            <Suspense fallback={null}>
              <SearchForm initialQuery={initialQuery} />
            </Suspense>
          </div>
        </Toolbar>
      </PageContainer>
    </AppBar>
  );
}
