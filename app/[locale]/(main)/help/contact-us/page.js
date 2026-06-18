import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { MdStorefront, MdEmail, MdPhone } from "react-icons/md";
import ContactForm from "./ContactForm";
import { fetchData } from "@/lib/fetch-data";
import ViewHTML from "@/components/elements/ViewHTML";

const ContactUs = async () => {
  const [settingsRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};

  return (
    <>
      {/* <div className="breadcrumb breadcrumb-2 py-5">
        <div className="container">
          <div>
            <Link
              href={`/`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              Home
            </Link>
            <Link
              href={`/help/contact-us`}
              className="text-base text-slate-900 hover:text-secondary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div> */}

      <div className="py-12 bg-gray-50">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <div className="flex  items-center gap-3 mb-2">
              <div style={{
						color: settings?.colors?.default_text,
						backgroundColor: settings?.colors?.secondary
					}}
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                G
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  We&apos;re here to listen to you!
                </h1>
                <p className="text-gray-500">Let&apos;s connect</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
            {/* Left Column - Contact Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm px-2 py-4 lg:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdStorefront className=" text-2xl" style={{
                      color: settings?.colors?.default_text,
                     
                    }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      {/* Text */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Our Stores
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Find the nearest {settings?.name} outlet.
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Locations and opening hours
                        </p>
                      </div>

                      <div className="mt-2 sm:mt-0">
                        <Link
                          href="/pages/our-locations"
                          className="px-4 lg:px-8 py-2 text-center  border  rounded-full text-sm font-medium hover:bg-red-50 transition whitespace-nowrap block sm:inline-block"
                          style={{
                            color: settings?.colors?.default_text,
                            border: `1px solid ${settings?.colors?.primary}`,
                          }}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className="bg-white rounded-xl shadow-sm px-2 py-4 lg:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdEmail className="text-red-800 text-2xl" style={{
                      color: settings?.colors?.default_text,
                     
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      {/* Text */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Email
                        </h3>
                        <div className="text-sm text-gray-600 mb-1">
                          {settings?.email?.map((e, index) => (
                            <Link
                              key={index}
                              href={`mailto:${settings?.email[index]}`}
                              className="hover:text-red-800"
                            >
                              {settings?.email[index]}
                              {index + 1 < settings.email.length ? ", " : ""}
                            </Link>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Reply within 1-2 business days
                        </p>
                      </div>

                      <div className="mt-2 sm:mt-0">
                        <Link
                          href={`mailto:${settings?.email?.[0]}`}
                          className="px-4 lg:px-8 py-2 text-center text-red-800 border border-red-800 rounded-full text-sm font-medium hover:bg-red-50 transition block sm:inline-block"
                          style={{
                            color: settings?.colors?.default_text,
                            border: `1px solid ${settings?.colors?.primary}`,
                          }}
                         >
                          Write
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call */}
              <div className="bg-white rounded-xl shadow-sm px-2 py-4 lg:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdPhone className="text-red-800 text-2xl"   style={{
                      color: settings?.colors?.default_text,
                     
                    }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Call
                        </h3>
                        <div className="text-sm text-gray-600 mb-1">
                          {settings?.phone?.map((e, index) => (
                            <Link
                              key={index}
                              href={`tel:${settings?.phone[index]}`}
                              className="hover:text-red-800"
                            >
                              {settings?.phone[index]}
                              {index + 1 < settings.phone.length ? ", " : ""}
                            </Link>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Sat-Thu, 10 AM - 7 PM
                        </p>
                      </div>

                      {/* Button */}
                      <div className="mt-2 sm:mt-0">
                        <Link
                          href={`tel:${settings?.phone?.[0]}`}
                          className="px-6 lg:px-8 py-2 text-center  border border-red-800 rounded-full text-sm font-medium hover:bg-red-50 transition block sm:inline-block"
                          style={{
                            color: settings?.colors?.default_text,
                            border: `1px solid ${settings?.colors?.primary}`,
                          }}
                        >
                          Call
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="bg-white rounded-xl shadow-sm px-2 py-4 lg:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Follow us</h3>
                <div className="flex gap-3">
                  {settings.facebook_link && settings.facebook_link !== "#" && (
                    <Link
                      href={settings.facebook_link}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      <FaFacebookF className="text-gray-600" />
                    </Link>
                  )}
                  {settings.instagram_link &&
                    settings.instagram_link !== "#" && (
                      <Link
                        href={settings.instagram_link}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        <FaInstagram className="text-gray-600" />
                      </Link>
                    )}

                  {settings.linkedin_link && settings.linkedin_link !== "#" && (
                    <Link
                      href={settings.linkedin_link}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      <FaLinkedinIn className="text-gray-600" />
                    </Link>
                  )}

                  {settings.youtube_link && settings.youtube_link !== "#" && (
                    <Link
                      href={settings.youtube_link}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      <FaYoutube className="text-gray-600" />
                    </Link>
                  )}
                </div>
              </div>

              {/* {settings.google_map_link && (
                <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6">
                  <div className="[&>div>iframe]:w-full [&>div>iframe]:rounded-lg [&>div>iframe]:h-64">
                    <ViewHTML htmlText={settings.google_map_link} />
                  </div>
                </div>
              )} */}
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
