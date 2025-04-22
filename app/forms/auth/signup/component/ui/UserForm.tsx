"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod validation schema
const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

  type UserFormProps = {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
  }

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

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

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;
