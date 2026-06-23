import { fetchCharacterById } from "../../../api/charactersApi";
import type { Character } from "../../../types/character";

const escapeCsvValue = (value: string | number) => {
  const stringValue = String(value);

  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
};

const createCsv = (characters: Character[]) => {
  const headers = ["id", "name", "status", "species", "gender", "detailsUrl"];

  const rows = characters.map((character) => [
    character.id,
    character.name,
    character.status,
    character.species,
    character.gender ?? "",
    `https://rickandmortyapi.com/api/character/${character.id}`,
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
};

const getIdsFromFormData = (formData: FormData) => {
  return formData
    .getAll("ids")
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const ids = [...new Set(getIdsFromFormData(formData))];

  if (ids.length === 0) {
    return new Response("No selected characters provided.", { status: 400 });
  }

  try {
    const characters = await Promise.all(ids.map((id) => fetchCharacterById(String(id))));
    const csv = createCsv(characters);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${characters.length}_items.csv"`,
      },
    });
  } catch {
    return new Response("Unable to generate CSV file.", { status: 500 });
  }
}