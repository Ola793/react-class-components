import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { useFormStore } from "./store/formStore";

describe("App", () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
    });
  });

  it("renders main page with action buttons", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /react forms/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open uncontrolled form/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open react hook form/i })).toBeInTheDocument();
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
  });

  it("opens uncontrolled form modal", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /open uncontrolled form/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /uncontrolled form/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit uncontrolled form/i })).toBeInTheDocument();
  });

  it("opens react hook form modal", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /open react hook form/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /react hook form/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit react hook form/i })).toBeInTheDocument();
  });

  it("displays saved submissions from store", () => {
    useFormStore.getState().addSubmission({
      formType: "uncontrolled",
      name: "Olha",
      age: 30,
      email: "olha@example.com",
      gender: "Female",
      termsAccepted: true,
      password: "Password1!",
      country: "Poland",
      imageBase64: "data:image/png;base64,test",
    });

    render(<App />);

    expect(screen.getByRole("heading", { name: /olha/i })).toBeInTheDocument();
    expect(screen.getByText(/olha@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/30 years old/i)).toBeInTheDocument();
    expect(screen.getByText(/poland/i)).toBeInTheDocument();
    expect(screen.getByText(/submitted from: uncontrolled/i)).toBeInTheDocument();
  });
});
