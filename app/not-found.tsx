import { Box, Button, Typography } from "@mui/material";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Box
          role="status"
          sx={{ px: 2, py: { xs: 8, md: 12 }, textAlign: "center" }}
        >
          <Typography component="h1" variant="h3" gutterBottom>
            Page not found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            The photo or page you requested does not exist.
          </Typography>
          <Button href="/" variant="contained">
            Back to gallery
          </Button>
        </Box>
      </PageContainer>
    </main>
  );
}
