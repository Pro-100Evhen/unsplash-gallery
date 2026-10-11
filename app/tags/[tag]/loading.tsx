import { GalleryLoadingState } from "@/components/feedback/GalleryLoadingState";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "../../page.module.scss";

export default function TagLoading() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <GalleryLoadingState title="Loading tagged photos…" />
      </PageContainer>
    </main>
  );
}
