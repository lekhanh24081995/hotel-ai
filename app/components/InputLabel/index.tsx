'use client';

import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';

type InputLabelProps = {
  label?: string;
  error?: FieldError;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputLabel: FC<InputLabelProps> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="relative block w-full">
        <input
          className={`focus:border-link focus:ring-link w-full rounded-[4px] border ${error ? 'border-red-500' : 'border-[#79747E]'} bg-white p-4 text-[14px] text-[#49454F] placeholder:text-[14px] placeholder:text-[#49454F] focus:border-[3px] focus:outline-none`}
          type="text"
          {...props}
        />
        <span className="absolute left-0 top-0 -mt-2 ml-2 cursor-pointer bg-white px-1 text-[10px] text-[#49454F] transition-colors duration-300">
          {label}
        </span>
      </label>
      {error && <p className="text-sm text-red-500">{error?.message}</p>}
    </div>
  );
};
