import { useRef, useState } from "react";
import { OTP_LENGTH } from "../utils/emailVerificationUtils";

const EMPTY_DIGITS = Array(OTP_LENGTH).fill("");

export default function useOtpDigits(onDigitsEntered) {
  const [digits, setDigits] = useState(EMPTY_DIGITS);
  const digitRefs = useRef([]);

  const otp = digits.join("");

  // Gõ một số hoặc autofill nhiều số
  const applyDigits = (index, value) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) {
      setDigits((prev) => prev.map((digit, i) => (i === index ? "" : digit)));
      return;
    }

    const start = numbers.length === OTP_LENGTH ? 0 : index;

    setDigits((prev) => {
      const next = [...prev];

      [...numbers].slice(0, OTP_LENGTH - start).forEach((digit, i) => {
        next[start + i] = digit;
      });

      return next;
    });

    onDigitsEntered?.();

    const target = Math.min(OTP_LENGTH - 1, start + numbers.length);

    digitRefs.current[target]?.focus();
  };

  // Dán mã OTP từ clipboard
  const handlePaste = (event, index) => {
    const text = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!text) return;

    event.preventDefault();

    const start = text.length === OTP_LENGTH ? 0 : index;

    setDigits((prev) => {
      const next = [...prev];

      [...text].slice(0, OTP_LENGTH - start).forEach((digit, i) => {
        next[start + i] = digit;
      });

      return next;
    });

    onDigitsEntered?.();

    const target = Math.min(OTP_LENGTH - 1, start + text.length);

    digitRefs.current[target]?.focus();
  };

  // Điều hướng bằng bàn phím
  const handleKeyDown = (event, index) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      digitRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      digitRefs.current[index + 1]?.focus();
    } else if (event.key === "Backspace") {
      event.preventDefault();

      if (digits[index]) {
        setDigits((prev) => prev.map((digit, i) => (i === index ? "" : digit)));
      } else if (index > 0) {
        setDigits((prev) =>
          prev.map((digit, i) => (i === index - 1 ? "" : digit)),
        );

        digitRefs.current[index - 1]?.focus();
      }
    }
  };

  const resetDigits = () => {
    setDigits([...EMPTY_DIGITS]);
  };

  const focusFirstDigit = () => {
    digitRefs.current[0]?.focus();
  };

  return {
    digits,
    otp,
    digitRefs,
    applyDigits,
    handlePaste,
    handleKeyDown,
    resetDigits,
    focusFirstDigit,
  };
}
