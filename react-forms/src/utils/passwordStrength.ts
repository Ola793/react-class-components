export interface PasswordStrength {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialCharacter: boolean;
}

export function getPasswordStrength(password: string): PasswordStrength {
  return {
    hasNumber: [...password].some((character) => character >= '0' && character <= '9'),
    hasUppercase: [...password].some(
      (character) => character >= 'A' && character <= 'Z'
    ),
    hasLowercase: [...password].some(
      (character) => character >= 'a' && character <= 'z'
    ),
    hasSpecialCharacter: [...password].some(
      (character) => !/[a-zA-Z0-9]/.test(character)
    ),
  };
}