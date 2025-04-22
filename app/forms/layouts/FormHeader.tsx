import React from 'react'

type TextProp ={
    text: string;
}

const FormHeader: React.FC<TextProp> = ({text}) => {
  return (
    <div>
      <h3 className="text-xl text-[#1F2024] font-bold text-center my-3">
        {text}
      </h3>
    </div>
  );
};

export default FormHeader