import { GallerySkeleton } from "@/components/feedback/GallerySkeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <h1 className={styles.heading}>Discover photos</h1>
        <GallerySkeleton />
      </PageContainer>
    </main>
  );
}
