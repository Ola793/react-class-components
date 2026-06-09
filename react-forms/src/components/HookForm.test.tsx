import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFormStore } from "../store/formStore";
import { HookForm } from "./HookForm";

const createImage = () =>
  new File([new Uint8Array([1, 2, 3])], "avatar.png", {
    type: "image/png",
  });

const uploadImage = async () => {
  const imageInput = screen.getByLabelText(/^image$/i) as HTMLInputElement;
  const image = createImage();

  fireEvent.change(imageInput, {
    target: {
      files: [image],
    },
  });

  await waitFor(() => {
    expect(imageInput.files?.[0]).toBe(image);
  });
};

describe("HookForm", () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
      countries: ["Poland", "Ukraine", "Germany", "France", "Spain", "Italy", "United Kingdom", "United States"],
    });
  });

  it("disables submit button when form is invalid", () => {
    render(<HookForm onSuccess={vi.fn()} />);

    expect(screen.getByRole("button", { name: /submit react hook form/i })).toBeDisabled();
  });

  it("shows validation errors after interacting with invalid fields", async () => {
    const user = userEvent.setup();

    render(<HookForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/^name$/i), "olha");
    await user.type(screen.getByLabelText(/^email$/i), "invalid-email");
    fireEvent.change(screen.getByLabelText(/^age$/i), {
      target: {
        value: "-1",
      },
    });

    await user.type(screen.getByLabelText(/^password$/i), "Password1!");
    await user.type(screen.getByLabelText(/^confirm password$/i), "AnotherPassword1!");

    screen.debug();

    expect(await screen.findByText(/name must start with an uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/age cannot be negative/i)).toBeInTheDocument();
  });

  it("stores valid react hook form submission and calls onSuccess", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<HookForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/^name$/i), "Olha");
    await user.clear(screen.getByLabelText(/^age$/i));
    await user.type(screen.getByLabelText(/^age$/i), "30");
    await user.type(screen.getByLabelText(/^email$/i), "olha@example.com");
    await user.selectOptions(screen.getByLabelText(/^gender$/i), "Female");
    await user.type(screen.getByLabelText(/^country$/i), "Poland");
    await user.type(screen.getByLabelText(/^password$/i), "Password1!");
    await user.type(screen.getByLabelText(/^confirm password$/i), "Password1!");
    await uploadImage();
    await user.click(screen.getByLabelText(/terms and conditions/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit react hook form/i })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: /submit react hook form/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    const submissions = useFormStore.getState().submissions;

    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      formType: "react-hook-form",
      name: "Olha",
      age: 30,
      email: "olha@example.com",
      gender: "Female",
      termsAccepted: true,
      country: "Poland",
      password: "Password1!",
    });
    expect(submissions[0].imageBase64).toContain("data:image/png;base64");
  });

  it("shows country validation error when country is not from store", async () => {
    const user = userEvent.setup();

    render(<HookForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/^name$/i), "Olha");
    await user.clear(screen.getByLabelText(/^age$/i));
    await user.type(screen.getByLabelText(/^age$/i), "30");
    await user.type(screen.getByLabelText(/^email$/i), "olha@example.com");
    await user.selectOptions(screen.getByLabelText(/^gender$/i), "Female");
    await user.type(screen.getByLabelText(/^country$/i), "Atlantis");
    await user.type(screen.getByLabelText(/^password$/i), "Password1!");
    await user.type(screen.getByLabelText(/^confirm password$/i), "Password1!");
    await uploadImage();
    await user.click(screen.getByLabelText(/terms and conditions/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit react hook form/i })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: /submit react hook form/i }));

    expect(await screen.findByText(/country must be selected from the list/i)).toBeInTheDocument();

    expect(useFormStore.getState().submissions).toHaveLength(0);
  });
});
