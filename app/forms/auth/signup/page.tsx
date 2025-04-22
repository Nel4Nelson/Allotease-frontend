"use client"

import React, { useState } from "react";
import FormHeader from "../../layouts/FormHeader";
import FormFooter from "../../layouts/FormFooter";
import SignupNav from "./component/layout/SignupNav";
import Admin from "./component/layout/Admin";
import Attendee from "./component/layout/Attendee";


const Signup= () => {
  const [selectedType, setSelectedType] = useState("");

  return (
    <div className="bg-gradient-to-t from-white via-[#FFF3E659] to-[#d5ffeb] flex items-center justify-center w-full  min-h-screen">
      <div className="max-w-[20rem]">
        <FormHeader text="Register a New Account" />

        {selectedType === "" && (
          <SignupNav onSelect={(type) => setSelectedType(type)} />
        )}

        {selectedType === "attendee" && (
          <>
            <Attendee  />
          </>
        )}

         {selectedType === "admin" && (
          <Admin  />
        )}

        <FormFooter />
      </div>
    </div>
  );
};

export default Signup;
