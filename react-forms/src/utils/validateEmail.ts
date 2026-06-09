export function validateEmail(value: string) {
  const parts = value.split("@");

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  if (!localPart || !domain) {
    return false;
  }

  return domain.includes(".");
}
