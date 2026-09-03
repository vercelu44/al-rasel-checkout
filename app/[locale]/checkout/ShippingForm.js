import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import { siteConfig } from "@/config/site";

const ShippingForm = ({
  register,
  handleSubmit,
  handleCheckoutSubmit,
  errors,
  user,
  isLoading,
  translations,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {translations["shipping-address"] || "Billing Details"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Fill in your delivery information</p>
        </div>
      </div>

      <form className="w-full" onSubmit={handleSubmit(handleCheckoutSubmit)}>
        {isLoading ? (
          <ArticleLoader />
        ) : (
          <div className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {translations["name"] || "Your Name"} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                defaultValue={user?.name}
                placeholder="সম্পূর্ণ নামটি লিখুন"
                {...register("name", { required: "Name is required." })}
                className={`w-full px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 border rounded-xl outline-none transition-all duration-200 ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-slate-200 bg-white focus:border-black focus:ring-0 focus:ring-slate-100 focus:placeholder:text-white"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {translations["phone-number"] || "Mobile Number"} <span className="text-red-400">*</span>
              </label>
              <div className={`flex items-center border rounded-xl overflow-hidden transition-all duration-200 ${
                errors.phone
                  ? "border-red-300 bg-red-50 focus-within:border-red-400"
                  : "border-slate-200 bg-white focus-within:border-black focus-within:ring-2 focus-within:ring-slate-100"
              }`}>
                <span className="px-3 py-3 text-sm text-slate-400 border-r border-slate-200 bg-slate-50 select-none whitespace-nowrap">
                  +88
                </span>
                <input
                  type="tel"
                  defaultValue={user?.phone || user?.alt_phone_no}
                  placeholder="১১ ডিজিটের মোবাইল নাম্বারটি লিখুন"
                  {...register("phone", {
                    required: "Phone number is required.",
                    pattern: {
                      value: siteConfig.phone.patternWithCode,
                      message: "Please enter a valid bangladeshi number",
                    },
                  })}
                  className="flex-1 px-3 border-none focus:border-none py-3 focus:placeholder:text-white font-medium text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone.message}
                </p>
              )}
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {translations["email"] || "Your Email"} {" "}
                 <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                defaultValue={user?.email} 
                placeholder="সম্পূর্ণ ইমেইল এড্রেসটি লিখুন"
                {...register("email")}
                className={`w-full px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 border rounded-xl outline-none transition-all duration-200 ${
                  errors.email
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-slate-200 bg-white focus:border-black focus:ring-0 focus:ring-slate-100 focus:placeholder:text-white"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {translations["address"] || "Full Address"} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                defaultValue={user?.address}
                placeholder="রোড নাম/নাম্বার, বাড়ি নাম/নাম্বার, ফ্লাট নাম্বার"
                {...register("address", { required: "Address line is required." })}
                className={`w-full px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 border rounded-xl outline-none transition-all duration-200 ${
                  errors.address
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-slate-200 bg-white focus:border-black focus:ring-0 focus:placeholder:text-white focus:ring-slate-100"
                }`}
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {translations["Note"] || "Order Note"}{" "}
                <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Any special instructions..."
                {...register("note")}
                className="w-full px-4 py-3 font-medium text-slate-800 placeholder:text-slate-400 border focus:placeholder:text-white border-slate-200 bg-white rounded-xl outline-none transition-all duration-200 focus:border-black focus:ring-0  focus:ring-slate-100"
              />
              {errors.note && (
                <p className="mt-1.5 text-xs text-red-500">{errors.note.message}</p>
              )}
            </div>

          </div>
        )}

  
      </form>
    </div>
  );
};

export default ShippingForm;