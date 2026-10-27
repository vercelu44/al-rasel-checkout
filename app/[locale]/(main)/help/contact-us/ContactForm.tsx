"use client";
import type * as React from "react";
import { useState } from "react";
import { MdPerson, MdMail, MdPhone, MdMessage } from "react-icons/md";
import { TbTag } from "react-icons/tb";
import { toast } from "react-toastify";
import { useContactNowMutation } from "@/store/api/contactAPI";
import { useAppSelector } from "@/store/hooks";

type ContactField = "name" | "email" | "phone" | "subject" | "otherSubject" | "message";
/** Validation message per field (empty = no error) */
type ContactFormErrors = Partial<Record<ContactField, string>>;

const ContactForm = () => {
  const [contactNow] = useContactNowMutation();
  	const { settings, translations } = useAppSelector((state) => state.common);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    otherSubject: "",
    message: "",
  });
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as ContactField]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      formData.email.trim() &&
      !/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!selectedSubject) {
      newErrors.subject = "Please select a subject";
    }

    if (selectedSubject === "Other" && !formData.otherSubject.trim()) {
      newErrors.otherSubject = "Please specify the subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject:
          selectedSubject === "Other" ? formData.otherSubject : selectedSubject,
        message: formData.message,
      };

      console.log("Form submitted:", payload);

      contactNow(payload)
        .unwrap()
        .then((response) => {
          toast.success(
            "Thanks for contacting us! We'll get back to you soon."
          );
          setFormData({
            name: "",
            email: "",
            phone: "",
            otherSubject: "",
            message: "",
          });
          setSelectedSubject("");
          setErrors({});
        })
        .catch((error) => {
          toast.error("Failed to send your message");
          console.log(error);
        });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 w-full lg:max-w-3xl overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Contact form
      </h2>

      <div className="w-full">
        {/* Name */}
        <div className="mb-4">
          <div className="relative">
            <MdPerson className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="relative">
              <MdMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type="email"
                name="email"
                placeholder="Email (Optional)"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <MdPhone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Select Subject */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
            Select subject
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["Order & Delivery", "Exchange", "Claim", "Other"].map(
              (subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full border transition text-xs sm:text-base font-medium ${
                    selectedSubject === subject
                      ? "bg-white text-gray-900 border-gray-300"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-800"
                  }`}
                >
                  <span className="whitespace-nowrap">{subject}</span>
                  <span
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedSubject === subject
                        ? "border-red-800"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedSubject === subject && (
                      <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-800"></span>
                    )}
                  </span>
                </button>
              )
            )}
          </div>
          {errors.subject && (
            <p className="text-red-600 text-xs sm:text-sm mt-2">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Other Subject Input */}
        {selectedSubject === "Other" && (
          <div className="mb-4">
            <div className="relative">
              <TbTag className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type="text"
                name="otherSubject"
                placeholder="Other subject"
                value={formData.otherSubject}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {errors.otherSubject && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">
                {errors.otherSubject}
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <MdMessage className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 text-lg sm:text-xl" />
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent resize-none text-sm sm:text-base"
            />
          </div>
          {errors.message && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
            By sending, you agree to our terms & privacy.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3   rounded-lg font-medium  transition text-sm sm:text-base order-1 sm:order-2"
             style={{
                    border: `1px solid ${settings?.colors?.primary}`,
                    backgroundColor: settings?.colors?.secondary,
                    color: settings?.colors?.secondary_text,
                  }}
             >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
