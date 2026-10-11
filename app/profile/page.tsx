import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileCollection } from "@/features/collection/ProfileCollection";
import styles from "../page.module.scss";

export default function ProfilePage() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <ProfileCollection />
      </PageContainer>
    </main>
  );
}
