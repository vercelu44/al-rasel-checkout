"use client";
const CustomRadio = ({ isChecked, label, ...props }) => {
  return (
    <div {...props} className="flex items-center gap-2">
      <div
        className={`rounded-full p-1 border ${
          isChecked ? "border-primary" : "border-primary"
        } bg-white`}
      >
        <div
          className={`${
            isChecked ? "bg-primary" : "bg-white"
          } rounded-full h-3 w-3`}
        ></div>
      </div>
      {label ? <p>{label}</p> : null}
    </div>
  );
};

export default CustomRadio;
