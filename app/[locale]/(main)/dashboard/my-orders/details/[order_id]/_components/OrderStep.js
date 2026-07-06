import { getFormattedDate } from "@/utils/format-date";
import { HiCheck } from "react-icons/hi2";

export default function OrderStep({ title, message, date, isComplete }) {
  return (
    <li className="relative flex gap-4 pb-8">
      {/* Circle */}
      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2
        ${
          isComplete
            ? "border-primary bg-primary text-white"
            : "border-slate-300 bg-white text-slate-400"
        }`}
      >
        {isComplete ? (
          <HiCheck className="text-lg" />
        ) : (
          <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        )}
      </div>

      {/* Content */}
      <div
        className={`relative flex-1 rounded-r-2xl rounded-bl-2xl rounded-tl-md border p-4
    ${isComplete ? "border-blue-100 bg-blue-50" : "border-slate-200 bg-white"}`}
      >
        <span
          className={`absolute -left-[10px] top-3 h-5 w-5 rounded-bl-md border-l border-b rotate-45
					${
						isComplete ? "border-blue-100 bg-blue-50" : "border-slate-200 bg-white"
					}`}
        />
        <h3 className="font-semibold">{title}</h3>

        {date && (
          <p className="mt-1 text-xs text-slate-500">
            {getFormattedDate(date)}
          </p>
        )}

        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </div>
    </li>
  );
}
