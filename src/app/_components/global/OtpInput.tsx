import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

interface OtpInputProps {
  numInputs?: number;
  // for generic controlled component
  value?: string;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  error?: string;
  // for formik integration
  name?: string;
}

export default function OtpInput({
  numInputs = 6,
  value,
  onChange,
  onBlur,
  error,
  name,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>([]);

  useEffect(() => {
    const initialValue = value || "";
    const newOtp = initialValue.split("").slice(0, numInputs);
    if (newOtp.length < numInputs) {
      const remaining = Array(numInputs - newOtp.length).fill("");
      setOtp([...newOtp, ...remaining]);
    } else {
      setOtp(newOtp);
    }
  }, [value, numInputs]);

  const inputRefs = Array.from({ length: numInputs }, () =>
    useRef<HTMLInputElement>(null)
  );

  const handleChange = (otpValue: string) => {
    if (onChange) {
      onChange(otpValue);
    }
  };

  // --- Logic for the OTP Input ---
  const handleOtpChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (isNaN(Number(inputValue))) return; // Only allow numbers

      const newOtp = [...otp];
      newOtp[index] = inputValue.slice(-1); // Only take the last digit
      setOtp(newOtp);

      const finalCode = newOtp.join("");
      handleChange(finalCode);

      // Move focus to next input
      if (inputValue && index < numInputs - 1) {
        inputRefs[index + 1].current?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        // Move focus to previous input on backspace
        inputRefs[index - 1].current?.focus();
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, numInputs);
    if (new RegExp(`^[0-9]{${numInputs}}$`).test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      handleChange(pasteData);
      inputRefs[numInputs - 1].current?.focus(); // Focus last input
    }
  };

  return (
    <div className="w-full">
      {/* OTP Input Grid */}
      <div className="flex justify-between space-x-2" onPaste={handlePaste}>
        {Array.from({ length: numInputs }).map((_, index) => (
          <input
            name={name}
            key={index}
            ref={inputRefs[index]}
            type="text" // Use "text" for better control
            inputMode="numeric" // Show number pad on mobile
            maxLength={1}
            value={otp[index] || ""}
            onChange={handleOtpChange(index)}
            onKeyDown={handleKeyDown(index)}
            className="h-10 w-10 rounded-md border border-gray-300 text-center text-2xl font-medium text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:h-14 sm:w-14"
          />
        ))}
      </div>
      {/* Show error message */}
      {error && (
        <p className="pt-1 text-center text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
