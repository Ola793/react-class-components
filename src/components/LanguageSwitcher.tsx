"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../i18n/navigation";

const locales = ["en", "uk"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: event.target.value });
  };

  return (
    <label className="language-switcher">
      <span>Language:</span>
      <select value={locale} onChange={handleChange}>
        {locales.map((availableLocale) => (
          <option key={availableLocale} value={availableLocale}>
            {availableLocale.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
