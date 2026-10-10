import { GalleryLoadingState } from "@/components/feedback/GalleryLoadingState";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <GalleryLoadingState title="Discover Photos" />
      </PageContainer>
    </main>
  );
}
