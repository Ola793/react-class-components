"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { startTransition } from "react";
import { usePathname, useRouter } from "../i18n/navigation";

const locales = ["en", "uk"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- next-intl requires params for localized dynamic routes
        { pathname, params },
        { locale: nextLocale }
      );
    });
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