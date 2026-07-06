import { getOrderTrackingData } from "./order-utils";

export default function OrderTracking({ translations, orderData }) {
const {
  steps,
  totalSteps,
  completedSteps,
  progress,
  activeStepData,
} = getOrderTrackingData(orderData, translations);

  

  return (
    <div className="hidden lg:block">
      <div className="w-full rounded-xl border border-sky-100 bg-[#F0F9FF] p-10">
        <div className="relative flex items-center justify-between">
          {/* Background Line */}
          <div className="absolute top-5 left-[30px] right-[20px] h-[6px] rounded-full bg-[#BFDBFE]" />

          {/* Active Line */}
          <div
            className="absolute left-[30px] top-5 h-[6px] rounded-full bg-[#2563EB] transition-all duration-500"
            style={{
              width: `calc((100% - 44px) * ${Math.max(progress, 0) / 100})`,
            }}
          />

          {steps.map((step, index) => {
            const done = step.completed;

            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center"
              >
                {/* Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 font-bold transition-all ${
                    done
                      ? "border-[#2563EB] bg-white text-[#2563EB]"
                      : "border-[#BFDBFE] bg-white text-[#94A3B8]"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Title */}
                <p
                  className={`mt-4 text-center text-sm font-semibold ${
                    done ? "text-[#1E3A8A]" : "text-[#64748B]"
                  }`}
                >
                  {step?.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Status Card */}
        <div className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Current Status
                </p>

                <h3 className="mt-1 text-xl font-bold capitalize text-[#1E3A8A]">
                  {activeStepData?.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {activeStepData?.description}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Progress</p>

                <p className="text-3xl font-bold text-[#2563EB]">
                  {completedSteps}/{totalSteps}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                style={{
                  width: `${(completedSteps / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}