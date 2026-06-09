import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFormStore } from "../store/formStore";
import { UncontrolledForm } from "./UncontrolledForm";

const createImage = () =>
  new File([new Uint8Array([1, 2, 3])], "avatar.png", {
    type: "image/png",
  });

const uploadImage = async (user: ReturnType<typeof userEvent.setup>) => {
  const imageInput = screen.getByLabelText(/^image$/i) as HTMLInputElement;
  const image = createImage();

  await user.upload(imageInput, image);

  expect(imageInput.files?.[0]).toBe(image);
};

describe("UncontrolledForm", () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
      countries: ["Poland", "Ukraine", "Germany", "France", "Spain", "Italy", "United Kingdom", "United States"],
    });
  });

  it("shows validation errors after submitting empty form", async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /submit uncontrolled form/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
    expect(screen.getByText(/country is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please confirm password/i)).toBeInTheDocument();
    expect(screen.getByText(/you must accept terms and conditions/i)).toBeInTheDocument();
  });

  it("stores valid uncontrolled form submission and calls onSuccess", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<UncontrolledForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/^name$/i), "Olha");
    await user.type(screen.getByLabelText(/^age$/i), "30");
    await user.type(screen.getByLabelText(/^email$/i), "olha@example.com");
    await user.selectOptions(screen.getByLabelText(/^gender$/i), "Female");
    await user.type(screen.getByLabelText(/^country$/i), "Poland");
    await user.type(screen.getByLabelText(/^password$/i), "Password1!");
    await user.type(screen.getByLabelText(/^confirm password$/i), "Password1!");
    await uploadImage(user);
    await user.click(screen.getByLabelText(/terms and conditions/i));

    await user.click(screen.getByRole("button", { name: /submit uncontrolled form/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    const submissions = useFormStore.getState().submissions;

    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      formType: "uncontrolled",
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

    render(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/^name$/i), "Olha");
    await user.type(screen.getByLabelText(/^age$/i), "30");
    await user.type(screen.getByLabelText(/^email$/i), "olha@example.com");
    await user.selectOptions(screen.getByLabelText(/^gender$/i), "Female");
    await user.type(screen.getByLabelText(/^country$/i), "Atlantis");
    await user.type(screen.getByLabelText(/^password$/i), "Password1!");
    await user.type(screen.getByLabelText(/^confirm password$/i), "Password1!");
    await uploadImage(user);
    await user.click(screen.getByLabelText(/terms and conditions/i));

    await user.click(screen.getByRole("button", { name: /submit uncontrolled form/i }));

    expect(await screen.findByText(/country must be selected from the list/i)).toBeInTheDocument();

    expect(useFormStore.getState().submissions).toHaveLength(0);
  });
});
