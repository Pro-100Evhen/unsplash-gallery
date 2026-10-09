import type { ReactNode } from "react";
import styles from "./PageContainer.module.scss";

type PageContainerProps = Readonly<{
  children: ReactNode;
}>;

export function PageContainer({ children }: PageContainerProps) {
  return <div className={styles.container}>{children}</div>;
}
