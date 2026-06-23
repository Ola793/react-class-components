import { getTranslations } from "next-intl/server";

export const dynamic = "force-static";

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return (
    <section className="content-section">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </section>
  );
}
