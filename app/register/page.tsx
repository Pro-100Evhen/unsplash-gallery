import { Typography } from "@mui/material";
import { PageContainer } from "@/components/layout/PageContainer";
import { RegistrationForm } from "@/features/auth/RegistrationForm";
import styles from "../page.module.scss";

export default function RegisterPage() {
  return (
    <main className={styles.main}>
      <PageContainer>
        <Typography
          component="h1"
          variant="h2"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Create a demo profile
        </Typography>
        <RegistrationForm />
      </PageContainer>
    </main>
  );
}
