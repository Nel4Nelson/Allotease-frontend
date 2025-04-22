"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../../layouts/SubmitButton";
import FormHeader from "@/app/forms/layouts/FormHeader";
import FormFooter from "@/app/forms/layouts/FormFooter";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="bg-gradient-to-t from-white via-[#FFF3E659] to-[#d5ffeb] flex items-center justify-center w-full  min-h-screen">
      <div className="max-w-[20rem]">
        <FormHeader text="Sign In" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <SubmitButton
            submitButtonText="Log In"
            isSubmitting
            alternateTest="Don’t have an account? "
            alternateSpanText="Sign up"
            googleButton
          />

          <FormFooter />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
