import React from "react";

function FormInput({ name, type, label }) {
  return (
    <fieldset className="fieldset w-full">
     
      <input
        type={type}
        className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm h-[40px] text-[16px] 
             transition-all duration-300 ease-in-out 
             transform focus:scale-105 focus:shadow-xl 
             focus:border-blue-500 focus:outline-none"
        name={name}
        placeholder={label}
        required
      />
    </fieldset>
  );
}

export default FormInput;