"use client";

import { Alert, AlertTitle, Button } from "@mui/material";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "./page.module.scss";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ reset }: ErrorProps) {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={reset}>
              Try again
            </Button>
          }
        >
          <AlertTitle>Could not load photos</AlertTitle>
          Check your connection or Unsplash configuration and retry.
        </Alert>
      </PageContainer>
    </main>
  );
}
