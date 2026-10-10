import { AppBar, Toolbar } from "@mui/material";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchForm } from "@/features/search/SearchForm";
import { AppHeaderBrand } from "./AppHeaderBrand";
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
          <AppHeaderBrand />
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
