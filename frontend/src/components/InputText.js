import React from 'react'

const InputText = ({ className, label, placeholder, value, onChange }) => {
    return (
      <div className={`mb-6 ${className}`}>
        <label className="text-lightGray-light">{label}</label>
        <input
          className="mt-2 px-4 py-3 bg-darkGray rounded focus:outline-none border-none w-full"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };

export default InputText