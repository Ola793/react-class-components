import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PasswordStrength } from "./PasswordStrength";

describe("PasswordStrength", () => {
  it("renders all password requirements", () => {
    render(<PasswordStrength password="" />);

    expect(screen.getByText(/1 number/i)).toBeInTheDocument();
    expect(screen.getByText(/1 uppercase/i)).toBeInTheDocument();
    expect(screen.getByText(/1 lowercase/i)).toBeInTheDocument();
    expect(screen.getByText(/1 special character/i)).toBeInTheDocument();
  });

  it("marks fulfilled password requirements as valid", () => {
    render(<PasswordStrength password="Aa1!" />);

    expect(screen.getByText("1 number")).toHaveClass("valid");
    expect(screen.getByText("1 uppercase")).toHaveClass("valid");
    expect(screen.getByText("1 lowercase")).toHaveClass("valid");
    expect(screen.getByText("1 special character")).toHaveClass("valid");
  });
});
