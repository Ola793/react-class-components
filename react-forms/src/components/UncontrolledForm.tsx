import { type FormEvent, useState } from "react";
import { z } from "zod";
import { formSchema } from "../schemas/formSchema";
import { useFormStore } from "../store/formStore";
import { fileToBase64 } from "../utils/fileToBase64";
import { PasswordStrength } from "./PasswordStrength";

interface UncontrolledFormProps {
  onSuccess: () => void;
}

type FormErrors = Partial<Record<keyof z.infer<typeof formSchema>, string>>;

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);

  const [errors, setErrors] = useState<FormErrors>({});
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageInput = form.elements.namedItem("image") as HTMLInputElement | null;
    const image = imageInput?.files?.[0];

    const values = {
      name: String(formData.get("name") ?? ""),
      age: String(formData.get("age") ?? ""),
      email: String(formData.get("email") ?? ""),
      gender: String(formData.get("gender") ?? ""),
      termsAccepted: formData.get("termsAccepted") === "on",
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      country: String(formData.get("country") ?? ""),
      image,
    };

    const result = formSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        nextErrors[field] = issue.message;
      });

      setErrors(nextErrors);
      return;
    }

    if (!countries.includes(result.data.country)) {
      setErrors({
        country: "Country must be selected from the list",
      });
      return;
    }

    const imageBase64 = await fileToBase64(result.data.image);

    addSubmission({
      formType: "uncontrolled",
      name: result.data.name,
      age: result.data.age,
      email: result.data.email,
      gender: result.data.gender,
      termsAccepted: result.data.termsAccepted,
      password: result.data.password,
      country: result.data.country,
      imageBase64,
    });

    setErrors({});
    form.reset();
    setPassword("");
    onSuccess();
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="uncontrolled-name">Name</label>
        <input id="uncontrolled-name" name="name" type="text" />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-age">Age</label>
        <input id="uncontrolled-age" name="age" type="number" />
        {errors.age && <p className="form-error">{errors.age}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-email">Email</label>
        <input id="uncontrolled-email" name="email" type="email" />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-gender">Gender</label>
        <select id="uncontrolled-gender" name="gender">
          <option value="">Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="form-error">{errors.gender}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-country">Country</label>
        <input id="uncontrolled-country" name="country" list="countries" type="text" />
        <datalist id="countries">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>
        {errors.country && <p className="form-error">{errors.country}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-password">Password</label>
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength password={password} />
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
        <input id="uncontrolled-confirm-password" name="confirmPassword" type="password" />
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="uncontrolled-image">Image</label>
        <input id="uncontrolled-image" name="image" type="file" accept="image/png,image/jpeg" />
        {errors.image && <p className="form-error">{errors.image}</p>}
      </div>

      <div className="form-checkbox">
        <input id="uncontrolled-terms" name="termsAccepted" type="checkbox" />
        <label htmlFor="uncontrolled-terms">I accept Terms and Conditions</label>
      </div>
      {errors.termsAccepted && <p className="form-error">{errors.termsAccepted}</p>}

      <button type="submit">Submit uncontrolled form</button>
    </form>
  );
}
