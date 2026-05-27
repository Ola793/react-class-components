import type { Character } from '../types/character';

const escapeCsvValue = (value: string | number) => {
  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
};

export const downloadSelectedItemsCsv = (items: Character[]) => {
  const headers = ['id', 'name', 'status', 'species', 'gender', 'detailsUrl'];

  const rows = items.map((item) => [
    item.id,
    item.name,
    item.status,
    item.species,
    item.gender ?? '',
    `https://rickandmortyapi.com/api/character/${item.id}`,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();

  URL.revokeObjectURL(url);
};