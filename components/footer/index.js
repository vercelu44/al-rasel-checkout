import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";

// ** Import Icons
import SocialIcon from "../elements/SocialIcon";
import ScrollToTopButton from "../ScrollToTopButton";
import MessagingButton from "./MessagingButton";
import {
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import Image from "next/image";
import AppleAppDownload from "../elements/svg/AppleAppDownload";
import AndroidAppDownload from "../elements/svg/AndroidAppDownload";
import sslImage from "@/public/assets/images/ssl.png";

const Footer = async () => {
  const translationData = await fetchData({ api: "translations" });
  const translations = translationData?.data || {};
  const { data: settings = {} } = await fetchData({ api: "info/basic" });

  const footerPage = settings?.footer_page || [];
  const helpPage = settings?.help_page || [];

  return (
    <footer
      className="footer py-5"
      style={{
        backgroundColor: settings?.colors?.secondary,
        color: settings?.colors?.secondary_text,
      }}
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-5 lg:gap-12 mt-8">
          <div className="footer-business-info">
            <Link href="/" className="logo inline-block mb-3">
             
                {settings?.footer_logo ? (
                  <Image
                  src={settings?.footer_logo}
                  alt={settings?.name}
                  width={200}
                  height={48}
                  className="h-auto max-h-[48px] w-auto object-contain lg:-mt-2"
                />
                ) : (
                    <span className="text-3xl font-bold inline-block">
                      {settings?.name}
                    </span>
                  )}

            </Link>
            <ul className="info-list pr-4 space-y-2 text-sm font-light">
              {settings?.addresses?.map((addr, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="pt-1">
                    <FaMapMarkerAlt size={16} color="#000" />
                  </span>
                  <p className="leading-snug">{addr}</p>
                </li>
              ))}

              <li className="flex items-center flex-wrap gap-2">
                <BsFillTelephoneFill size={16} />
                <span className="rtl:text-right" dir="ltr">
                  {settings?.phone?.map((e, index) => (
                    <Link key={index} href={`tel:${e}`}>
                      {`${e}${index + 1 < settings.phone.length ? "," : ""}`}
                    </Link>
                  ))}
                </span>
              </li>

              <li className="flex items-center gap-2 w-full max-w-full lg:flex-nowrap">
                <FaEnvelope size={16} className="shrink-0" />
                <div className="flex flex-wrap gap-x-1 gap-y-0.5 min-w-0">
                  {settings?.email?.map((e, index) => (
                    <Link key={index} href={`mailto:${e}`}>
                      {`${e}${index + 1 < settings.email.length ? "," : ""}`}
                    </Link>
                  ))}
                </div>
              </li>

              {settings?.trade_licence_no && (
                <li className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold">Trade license No:</span>
                  {settings?.trade_licence_no}
                </li>
              )}
            </ul>
          </div>
          <div className="text-lg font-light">
            <h6 className="mb-4 font-title uppercase font-bold">
              {translations["customer-service"] || "CUSTOMER SERVICE"}
            </h6>
            <ul className="widget-list">
              <li>
                <Link className="" href={"/help/contact-us"}>
                  {translations["contact"] || "Contact Us"}
                </Link>
              </li>
              <li>
                <Link className="" href={"/help/qna"}>
                  {translations["questions-and-queries"] ||
                    "Questions and Answer"}
                </Link>
              </li>
              <li>
                <Link className="" href={"/blogs"}>
                  {translations["Blogs"] || "Blogs"}
                </Link>
              </li>
              {helpPage.map((page) => (
                <li key={page?.path}>
                  <Link className="" href={page?.path}>
                    {page?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-lg font-light">
            <h6 className="mb-4 font-title uppercase font-bold">
              {translations["company"] || "COMPANY"}
            </h6>
            <ul className="widget-list">
              {footerPage.map((page) => (
                <li key={page?.path}>
                  <Link className="" href={page?.path}>
                    {page?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <>
              {settings?.ios_app_link || settings?.android_app_link ? (
                <div className="footer-app">
                  <p className="">Download our app now from stores</p>
                  <div className=" py-4 flex max-xl:items-center gap-4 xl:flex-col">
                    {settings?.ios_app_link && (
                      <a
                        href={settings?.ios_app_link}
                        target="_blank"
                        className=" flex justify-center lg:justify-start group w-max"
                      >
                        <AppleAppDownload />
                      </a>
                    )}
                    {settings?.android_app_link && (
                      <a
                        href={settings?.android_app_link}
                        target="_blank"
                        className="flex justify-center lg:justify-start group w-max"
                      >
                        <AndroidAppDownload />
                      </a>
                    )}
                  </div>
                </div>
              ) : null}
              <div className="social-links ">
                <h6 className="text-lg font-title uppercase font-bold">
                  Follow Us
                </h6>
                <div className="text-center py-4 flex gap-3 items-center">
                  {settings.facebook_link && settings.facebook_link !== "#" && (
                    <SocialIcon
                      href={settings.facebook_link}
                      icon={"/assets/icons/social/fb.svg"}
                    />
                  )}
                  {settings.whatsapp_link && settings.whatsapp_link !== "#" && (
                    <SocialIcon
                      href={settings.whatsapp_link}
                      icon={"/assets/icons/social/whatsapp.svg"}
                      iconClass={"w-7 h-7"}
                    />
                  )}
                  {settings.instagram_link &&
                    settings.instagram_link !== "#" && (
                      <SocialIcon
                        href={settings.instagram_link}
                        icon={"/assets/icons/social/instagram.svg"}
                      />
                    )}

                  {settings.twitter_link && settings.twitter_link !== "#" && (
                    <SocialIcon
                      href={settings.twitter_link}
                      icon={"/assets/icons/social/twitter.svg"}
                    />
                  )}

                  {settings.linkedin_link && settings.linkedin_link !== "#" && (
                    <SocialIcon
                      href={settings.linkedin_link}
                      icon={"/assets/icons/social/linkedin.svg"}
                    />
                  )}
                  {settings.youtube_link && settings.youtube_link !== "#" && (
                    <SocialIcon
                      href={settings.youtube_link}
                      icon={"/assets/icons/social/YouTube.svg"}
                    />
                  )}

                  {settings.tiktok_link && settings.tiktok_link !== "#" && (
                    <SocialIcon
                      href={settings.tiktok_link}
                      icon={"/assets/icons/social/TikTok.svg"}
                    />
                  )}

                  {settings.pinterest_link &&
                    settings.pinterest_link !== "#" && (
                      <SocialIcon
                        href={settings.pinterest_link}
                        icon={"/assets/icons/social/pinterest.svg"}
                      />
                    )}
                </div>
              </div>
            </>
          </div>
        </div>
        {settings?.footer_branding_section ? (
          <div className="flex justify-between items-center border-t border-slate-50 py-4 mt-4">
            <div className="w-1/2 flex flex-col md:flex-row items-center gap-1 text-center">
              <p className=" text-sm/6 font-light flex flex-wrap gap-1 justify-center">
                &copy; {new Date().getFullYear()}, All Rights Reserved By{" "}
                <Link href="/">{settings?.name}</Link> | Powered by
                <Link href="https://amarsolution.com" className="font-semibold">
                  AmarSolution
                </Link>
                {/* <SocialIcon
                href={"https://amarsolution.com/"}
                icon={"/assets/icons/amarsolution-logo.png"}
                iconClass={
                  "w-auto h-[25px] transition delay-150 duration-300 ease-in-out hover:-translate-1 hover:scale-105"
                }
              /> */}
              </p>
            </div>
            <div className="w-1/2">
              <Image src={sslImage} alt="no-image" className="object-contain" />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center border-t border-slate-50  mt-4">
            <div className="w-full text-center">
              <p className="text-sm/6 font-light mt-4">
                &copy; {new Date().getFullYear()}, All Rights Reserved By{" "}
                <Link href="/">{settings?.name}</Link>
              </p>
            </div>
          </div>
        )}
      </div>
      <ScrollToTopButton settings={settings} />

      <MessagingButton settings={settings} />
    </footer>
  );
};

export default Footer;
