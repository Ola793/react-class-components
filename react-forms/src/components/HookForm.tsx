import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { formSchema, type FormInputValues, type FormValues } from "../schemas/formSchema";
import { useFormStore } from "../store/formStore";
import { fileToBase64 } from "../utils/fileToBase64";
import { PasswordStrength } from "./PasswordStrength";

interface HookFormProps {
  onSuccess: () => void;
}

export function HookForm({ onSuccess }: HookFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const [countryError, setCountryError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormInputValues, undefined, FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      age: 0,
      email: "",
      gender: "",
      termsAccepted: false,
      password: "",
      confirmPassword: "",
      country: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    if (!countries.includes(data.country)) {
      setCountryError("Country must be selected from the list");
      return;
    }

    const imageBase64 = await fileToBase64(data.image);

    addSubmission({
      formType: "react-hook-form",
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      termsAccepted: data.termsAccepted,
      password: data.password,
      country: data.country,
      imageBase64,
    });

    setCountryError("");
    reset();
    onSuccess();
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label htmlFor="hook-name">Name</label>
        <input id="hook-name" type="text" {...register("name")} />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-age">Age</label>
        <input id="hook-age" type="number" {...register("age")} />
        {errors.age && <p className="form-error">{errors.age.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-email">Email</label>
        <input id="hook-email" type="email" {...register("email")} />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-gender">Gender</label>
        <select id="hook-gender" {...register("gender")}>
          <option value="">Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="form-error">{errors.gender.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-country">Country</label>
        <input id="hook-country" type="text" list="countries" {...register("country")} />
        <datalist id="countries">
          {countries.map((country) => (
            <option value={country} key={country} />
          ))}
        </datalist>
        {(errors.country || countryError) && <p className="form-error">{errors.country?.message ?? countryError}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-password">Password</label>
        <input id="hook-password" type="password" {...register("password")} />
        <PasswordStrength password={password} />
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-confirm-password">Confirm password</label>
        <input id="hook-confirm-password" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="hook-image">Image</label>
        <input
          id="hook-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register("image", {
            setValueAs: (files: FileList) => files.item(0),
          })}
        />
        {errors.image && <p className="form-error">{errors.image.message}</p>}
      </div>

      <div className="form-checkbox">
        <input id="hook-terms" type="checkbox" {...register("termsAccepted")} />
        <label htmlFor="hook-terms">I accept Terms and Conditions</label>
      </div>
      {errors.termsAccepted && <p className="form-error">{errors.termsAccepted.message}</p>}

      <button type="submit" disabled={!isValid}>
        Submit React Hook Form
      </button>
    </form>
  );
}
