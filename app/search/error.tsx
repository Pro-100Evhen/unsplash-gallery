"use client";

import { RouteErrorState } from "@/components/feedback/RouteErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "../page.module.scss";

type SearchErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function SearchError({ reset }: SearchErrorProps) {
  return (
    <main className={styles.main}>
      <PageContainer>
        <RouteErrorState
          title="Could not load search results"
          description="Check your connection or Unsplash configuration and retry."
          onRetry={reset}
        />
      </PageContainer>
    </main>
  );
}
