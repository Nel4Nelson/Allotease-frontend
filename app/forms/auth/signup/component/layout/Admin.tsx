import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationForm from "../ui/OrganizationForm";
import UserForm from "../ui/UserForm";
import { z } from "zod";
import SubmitButton from "@/app/forms/layouts/SubmitButton";

const Admin = () => {
  const [tab, setTab] = useState("1");

  const handleFormSubmit = (
    values: z.infer<typeof UserForm.prototype.formSchema>
  ) => {
    console.log("Form submitted:", values);
    // Go to next tab after successful form submission
  };

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab} className="max-w-[20rem]">
        <div className="flex justify-center">
          <TabsList className="grid w-[5rem] grid-cols-2 ">
            <TabsTrigger value="1">1</TabsTrigger>
            <TabsTrigger value="2">2</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="1" className="space-y-2">
          <UserForm onSubmit={handleFormSubmit} />
          <SubmitButton
            submitButtonText="Next"
            alternateTest="Already have an account?"
            alternateSpanText="Next"
            onClick={() => setTab("2")}
          />
        </TabsContent>

        <TabsContent value="2" className="space-y-2">
          <OrganizationForm />
          <SubmitButton
            submitButtonText="Sign Up"
            alternateTest="Already have an account?"
            alternateSpanText="Sign In"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
