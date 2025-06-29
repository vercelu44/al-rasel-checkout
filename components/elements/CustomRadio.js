// "use client";
// const CustomRadio = ({ isChecked, label, ...props }) => {
//   return (
//     <div {...props} className="flex items-center gap-2">
//       <div
//         className={`rounded-full p-1 border ${
//           isChecked ? "border-primary" : "border-slate-300"
//         } bg-white`}
//       >
//         <div
//           className={`${
//             isChecked ? "bg-primary" : "bg-white"
//           } rounded-full h-3 w-3`}
//         ></div>
//       </div>
//       {label ? <p>{label}</p> : null}
//     </div>
//   );
// };

// export default CustomRadio;



"use client";

const CustomRadio = ({ isChecked, label, icon, ...props }) => {
  return (
    <div {...props} className="flex items-center gap-2">
      <div
        className={`rounded-full p-1 border ${
          isChecked ? "border-primary" : "border-slate-300"
        } bg-white`}
      >
        <div
          className={`${
            isChecked ? "bg-primary" : "bg-white"
          } rounded-full h-3 w-3`}
        ></div>
      </div>
      {label ? (
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <p>{label}</p>
        </div>
      ) : null}
    </div>
  );
};

export default CustomRadio;

