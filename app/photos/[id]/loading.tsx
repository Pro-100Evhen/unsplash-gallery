import { Box, Skeleton, Stack } from "@mui/material";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "../../page.module.scss";

export default function PhotoLoading() {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Loading photo">
      <PageContainer>
        <Stack spacing={4} sx={{ py: { xs: 3, md: 4 } }}>
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: { xs: 280, sm: 480, lg: 640 } }}
          />
          <Box sx={{ width: "min(100%, 880px)", mx: "auto" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="min(240px, 70%)" />
                <Skeleton width="min(180px, 50%)" />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </PageContainer>
    </main>
  );
}
