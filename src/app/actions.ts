"use server";

import { redirect } from "next/navigation";
import { routing } from "../i18n/routing";

const DEFAULT_LOCALE = routing.defaultLocale;

export async function searchCharactersAction(formData: FormData) {
  const rawLocale = formData.get("locale");
  const rawSearchTerm = formData.get("searchTerm");

  const locale = typeof rawLocale === "string" ? rawLocale : DEFAULT_LOCALE;
  const searchTerm = typeof rawSearchTerm === "string" ? rawSearchTerm.trim() : "";

  const params = new URLSearchParams();
  params.set("page", "1");

  if (searchTerm) {
    params.set("query", searchTerm);
  }

  redirect(`/${locale}?${params.toString()}`);
}