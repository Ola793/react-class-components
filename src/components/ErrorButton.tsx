"use client";

import { useState } from "react";

export function ErrorButton() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error("Test application error");
  }

  const handleClick = () => {
    setHasError(true);
  };

  return (
    <button className="error-button" type="button" onClick={handleClick}>
      Simulate error
    </button>
  );
}
