import SubmitButton from "@/app/forms/layouts/SubmitButton";
import React from "react";
import { z } from "zod";
import UserForm from "../ui/UserForm";

const Attendee = () => {
  const handleFormSubmit = (
    values: z.infer<typeof UserForm.prototype.formSchema>
  ) => {
    console.log("Form submitted:", values);
    // Add your form submission logic here (API call, etc.)
  };
  return (
    <div>
      <UserForm onSubmit={handleFormSubmit} />

      <SubmitButton
        submitButtonText="Sign Up"
        // isSubmitting={isSubmitting}
        alternateTest="Already have an account?"
        alternateSpanText="Sign In"
        googleButton
      />
    </div>
  );
};

export default Attendee;
