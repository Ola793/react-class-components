import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({ title, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector);

    focusableElements?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = Array.from(modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

      if (elements.length === 0) {
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  const handleOverlayClick = () => {
    onClose();
  };

  const handleDialogClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
        ref={modalRef}
        role="dialog"
        onClick={handleDialogClick}
      >
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}
