import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod validation schema
const formSchema = z.object({
  organizationName: z
    .string()
    .min(1, { message: "Organization name is required." }),
  phoneNumber: z.string().regex(/^0\d{10}$/, {
    message: "Phone number must be 11 digits and start with 0.",
  }),
  bvn: z.string().regex(/^\d{11}$/, {
    message: "BVN must be exactly 11 digits.",
  }),
});

const OrganizationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      phoneNumber: "",
      bvn: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Organization Name */}
        <div>
          <input
            type="text"
            placeholder="Organization Name"
            {...register("organizationName")}
            className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
          />
          {errors.organizationName && (
            <p className="text-red-500 text-sm">
              {errors.organizationName.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register("phoneNumber")}
            className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* BVN */}
        <div>
          <input
            type="text"
            placeholder="Bank Verification Number (BVN)"
            {...register("bvn")}
            className="w-full p-2 border rounded-lg bg-[#F2F4F780] border-[#8AAEA433]"
          />
          {errors.bvn && (
            <p className="text-red-500 text-sm">{errors.bvn.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;
