import FieldsetInput from "@/components/elements/FieldsetInput";
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
    <div>
      <div className="text-left pb-5">
        <h3 className="text-xl">
          {translations["shipping-address"] || "Shipping Address"}
        </h3>
      </div>

      <form className="w-full" onSubmit={handleSubmit(handleCheckoutSubmit)}>
        {isLoading ? (
          <ArticleLoader />
        ) : (
          <>
            <div className="form-control mb-6">
              <FieldsetInput
                label={`${translations["name"] || "Name"}`}
                name="name"
                defaultValue={user?.name}
                register={register("name", {
                  required: "Name is required.",
                })}
              />
              {errors.name && <p className="errorMsg">{errors.name.message}</p>}
            </div>

            <div className="form-control mb-6">
              <FieldsetInput
                label={translations["address"] || "Address"}
                name="address"
                defaultValue={user?.address}
                register={register("address", {
                  required: "Address line is required.",
                })}
              />
              {errors.address && (
                <p className="errorMsg">{errors.address.message}</p>
              )}
            </div>
            <div className="form-control mb-6">
              <FieldsetInput
                label={translations["city"] || "City"}
                name="city"
                defaultValue={user?.city}
                register={register("city", {
                  required: "City is required.",
                })}
              />
              {errors.city && <p className="errorMsg">{errors.city.message}</p>}
            </div>
            <div className="form-control mb-6">
              <FieldsetInput
                label={`${translations["phone-number"] || "Phone Number"}`}
                name="phone"
                defaultValue={user?.phone || user?.alt_phone_no}
                register={register("phone", {
                  required: "Phone number is required.",
                  pattern: {
                    value: siteConfig.phone.patternWithCode,
                    message: "Please enter a valid bangladeshi number",
                  },
                })}
                type="tel"
                // disabled={!settings?.guest_ShippingForm}
              />

              {errors.phone && (
                <p className="errorMsg">{errors.phone.message}</p>
              )}
            </div>
          </>
        )}
        <div className="form-control my-6">
          <div className="border-b-2 border-slate-300 border-dashed"></div>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
