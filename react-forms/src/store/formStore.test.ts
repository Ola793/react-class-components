import { beforeEach, describe, expect, it } from "vitest";
import { useFormStore } from "./formStore";

describe("useFormStore", () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
    });
  });

  it("stores submitted form data", () => {
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

    const submissions = useFormStore.getState().submissions;

    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      formType: "uncontrolled",
      name: "Olha",
      age: 30,
      email: "olha@example.com",
      gender: "Female",
      termsAccepted: true,
      password: "Password1!",
      country: "Poland",
      imageBase64: "data:image/png;base64,test",
      isNew: true,
    });
  });

  it("adds newest submission first", () => {
    useFormStore.getState().addSubmission({
      formType: "uncontrolled",
      name: "First",
      age: 20,
      email: "first@example.com",
      gender: "Female",
      termsAccepted: true,
      password: "Password1!",
      country: "Poland",
      imageBase64: "data:image/png;base64,first",
    });

    useFormStore.getState().addSubmission({
      formType: "react-hook-form",
      name: "Second",
      age: 25,
      email: "second@example.com",
      gender: "Male",
      termsAccepted: true,
      password: "Password1!",
      country: "Ukraine",
      imageBase64: "data:image/png;base64,second",
    });

    const submissions = useFormStore.getState().submissions;

    expect(submissions[0].name).toBe("Second");
    expect(submissions[1].name).toBe("First");
  });

  it("marks submission as seen", () => {
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

    const submissionId = useFormStore.getState().submissions[0].id;

    useFormStore.getState().markSubmissionAsSeen(submissionId);

    expect(useFormStore.getState().submissions[0].isNew).toBe(false);
  });

  it("stores countries list", () => {
    expect(useFormStore.getState().countries).toContain("Poland");
    expect(useFormStore.getState().countries).toContain("Ukraine");
  });
});
