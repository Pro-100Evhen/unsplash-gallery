import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PhotoDetails } from "@/features/photo/PhotoDetails";
import { getPhoto } from "@/lib/unsplash/client";
import { UnsplashApiError } from "@/lib/unsplash/errors";
import styles from "../../page.module.scss";

type PhotoPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

async function getPhotoOrNotFound(id: string) {
  try {
    return await getPhoto(id);
  } catch (error) {
    if (error instanceof UnsplashApiError && error.category === "not-found") {
      notFound();
    }

    throw error;
  }
}

export async function generateMetadata({
  params,
}: PhotoPageProps): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhotoOrNotFound(id);
  const description = photo.description ?? photo.altDescription;

  return {
    title: description,
    description,
  };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { id } = await params;
  const photo = await getPhotoOrNotFound(id);

  return (
    <main className={styles.main}>
      <PageContainer>
        <PhotoDetails photo={photo} />
      </PageContainer>
    </main>
  );
}
