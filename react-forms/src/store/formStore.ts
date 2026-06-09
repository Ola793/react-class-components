import { create } from "zustand";

export type FormType = "uncontrolled" | "react-hook-form";

export interface FormSubmission {
  id: string;
  formType: FormType;
  name: string;
  age: number;
  email: string;
  gender: string;
  termsAccepted: boolean;
  password: string;
  country: string;
  imageBase64: string;
  createdAt: number;
  isNew: boolean;
}

interface FormStore {
  countries: string[];
  submissions: FormSubmission[];
  addSubmission: (submission: Omit<FormSubmission, "id" | "createdAt" | "isNew">) => void;
  markSubmissionAsSeen: (id: string) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  countries: ["Poland", "Ukraine", "Germany", "France", "Spain", "Italy", "United Kingdom", "United States"],

  submissions: [],

  addSubmission: (submission) =>
    set((state) => ({
      submissions: [
        {
          ...submission,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          isNew: true,
        },
        ...state.submissions,
      ],
    })),

  markSubmissionAsSeen: (id) =>
    set((state) => ({
      submissions: state.submissions.map((submission) =>
        submission.id === id ? { ...submission, isNew: false } : submission
      ),
    })),
}));
