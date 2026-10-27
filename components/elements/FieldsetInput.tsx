import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FieldsetInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  /** Result of react-hook-form `register("field")` */
  register?: Partial<UseFormRegisterReturn>;
}

export default function FieldsetInput({ label, register = {}, ...inputProps }: FieldsetInputProps) {
  return (
    <div className="relative min-w-[fit-content] w-full group">
      <input
        type="text"
        className="outline-none border-none px-3 py-3 peer"
        placeholder=" "
        {...register}
        {...inputProps}
      />

      <label
        className="absolute left-[9px] top-px text-sm text-gray-500 transition-all duration-300 px-1 transform -translate-y-1/2 pointer-events-none 
  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xl group-focus-within:!top-px group-focus-within:!text-sm group-focus-within:!text-primary"
      >
        {label}
      </label>

      {/* <!--This fieldset+legend is used for the border and notch transition--> */}
      <fieldset
        className="inset-0 absolute border border-slate-300 pointer-events-none mt-[-9px] invisible peer-placeholder-shown:visible 
  group-focus-within:!border-primary group-focus-within:border group-hover:border-primary"
      >
        <legend className="ml-2 px-0 text-sm transition-all duration-300 invisible max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1 whitespace-nowrap">
          {label}
        </legend>
      </fieldset>

      {/* <!--This fieldset+legend always has a notch and is shown when the input is filled, instead of the other, so the notch doesnt vanish when you unfocus the field--> */}
      <fieldset
        className="inset-0 absolute border border-slate-300 pointer-events-none mt-[-9px] visible peer-placeholder-shown:invisible 
  group-focus-within:border group-focus-within:!border-blue-500 group-hover:border-primary"
      >
        <legend className="ml-2 text-sm invisible px-1 max-w-full whitespace-nowrap">
          {label}
        </legend>
      </fieldset>
    </div>
  );
}

// fieldsetInput.propTypes = {
//   label: PropTypes.string.isRequired,
// };
