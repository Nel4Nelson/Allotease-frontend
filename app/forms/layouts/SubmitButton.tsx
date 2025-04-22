import React from "react";

type SubmitButtonProps = {
  submitButtonText?: string;
  isSubmitting?: boolean;
  alternateTest?: string;
  alternateSpanText?: string;
  googleButton?: boolean;
  onClick?: () => void;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  submitButtonText,
  alternateTest,
  alternateSpanText,
  googleButton,
  onClick,
}) => {
  return (
    <div className="font-source text-center space-y-2">
      {submitButtonText && (
        <button
          type="submit"
          className="px-4 py-2 bg-[#FF5B00] text-white rounded-full w-[13rem] font-semibold text-lg"
          onClick={onClick}
        >
          {submitButtonText}
        </button>
      )}
      {alternateTest && (
        <p className="text-[#71727A] text-sm">
          {alternateTest}{" "}
          <span className="text-[#FF5B00]">
            <u>{alternateSpanText}</u>
          </span>
        </p>
      )}
      <hr className="border w-full border-[#8AAEA480]" />
      {googleButton && (
        <button
          type="submit"
          className="px-4 py-2 bg-white text-[#FF5B00] rounded-full font-semibold text-lg"
        >
          @ Sign up with Google
        </button>
      )}
    </div>
  );
};

export default SubmitButton;
