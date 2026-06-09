import { getPasswordStrength } from '../utils/passwordStrength';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  return (
    <ul className="password-strength" aria-label="Password strength">
      <li className={strength.hasNumber ? 'valid' : ''}>1 number</li>
      <li className={strength.hasUppercase ? 'valid' : ''}>1 uppercase</li>
      <li className={strength.hasLowercase ? 'valid' : ''}>1 lowercase</li>
      <li className={strength.hasSpecialCharacter ? 'valid' : ''}>
        1 special character
      </li>
    </ul>
  );
}