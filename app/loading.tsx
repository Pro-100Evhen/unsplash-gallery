import { GallerySkeleton } from "@/components/feedback/GallerySkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Typography
          component="h1"
          variant="h2"
          sx={{ mb: 4, fontSize: { xs: "2rem", md: "3.5rem" } }}
        >
          Discover Photos
        </Typography>
        <GallerySkeleton />
      </PageContainer>
    </main>
  );
}
import { Typography } from "@mui/material";
