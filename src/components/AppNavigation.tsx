import { getTranslations } from "next-intl/server";
import { Link } from "../i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

type AppNavigationProps = {
  locale: string;
};

export async function AppNavigation({ locale }: AppNavigationProps) {
  const t = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <nav className="app-navigation">
      <Link href="/">{t("home")}</Link>
      <Link href="/about">{t("about")}</Link>
      <LanguageSwitcher />
      <ThemeSwitcher />
    </nav>
  );
}
