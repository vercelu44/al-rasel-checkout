"use client";
import { Link } from "@/navigation";
import Image from "next/image";
import amarsolutionLogo from "../../public/assets/icons/social/amarsolution-logo.png";

// ** Import Icons
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import FooterPages from "./FooterPages";
import SocialIcon from "../elements/SocialIcon";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useParams, usePathname } from "next/navigation";

const Footer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathArray = usePathname().split("/");
  const params = useParams();
  // console.log(pathArray);
  const { settings, settingsLoading, translationsLoading, translations } =
    useSelector((state) => state.common);

  if (settingsLoading || translationsLoading) return null;

  if (
    (isMobile && pathArray.includes("categories") && !params.slug) ||
    (isMobile && pathArray.includes("checkout")) ||
    (isMobile && pathArray.includes("dashboard")) ||
    (isMobile && pathArray.includes("mobile-login")) ||
    (isMobile && pathArray.includes("products") && params.slug)
  )
    return null;

  const footerPage = settings?.footer_page || [];
  const helpPage = settings?.help_page || [];

  return (
    <>
      <footer className="footer relative bg-slate-900 rounded-t-2xl lg:rounded-none pt-6 lg:pt-14 overflow-hidden z-10">
        <div className="footer-top pb-5">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 justify-between items-start gap-4 lg:gap-6">
              <div className="footer-widget">
                <Link href="/" className="logo inline-block mb-3">
                  <Image
                    src={settings?.footer_logo}
                    alt={settings?.name}
                    width={200}
                    height={48}
                    className="h-auto max-h-[48px] w-auto object-contain lg:-mt-2"
                  />
                </Link>
                <ul className="info-list">
                  <li className="!items-start">
                    <FaMapMarkerAlt size={24} color="#EF4444" />
                    <p className="pr-4">{settings?.address}</p>
                  </li>
                  <li className="flex items-center flex-wrap text-white gap-2">
                    <BsFillTelephoneFill ize={16} />
                    <span className="rtl:text-right" dir="ltr">
                      {settings?.phone?.map((e, index) => (
                        <Link
                          key={index}
                          href={`tel:${settings?.phone[index]}`}
                        >
                          {`${settings?.phone[index]}${
                            index + 1 < settings.phone.length ? "," : ""
                          }`}
                        </Link>
                      ))}
                    </span>
                  </li>
                  <li className="flex items-center flex-wrap text-white gap-2">
                    <FaEnvelope ize={16} />
                    {settings?.email?.map((e, index) => (
                      <Link
                        key={index}
                        href={`mailto:${settings?.email[index]}`}
                      >
                        {`${settings?.email[index]}${
                          index + 1 < settings.email.length ? "," : ""
                        }`}
                      </Link>
                    ))}
                  </li>
                </ul>
              </div>
              <FooterPages title={translations.company} pages={footerPage} />
              <FooterPages title={translations.help} pages={helpPage} />

              <div className="footer-widget mt-2 lg:mt-0 lg:self-center">
                <div className="footer-links mb-6">
                  <p>{translations["social-link"]}</p>
                  <div className="social-links flex items-center gap-5">
                    <SocialIcon
                      href={settings.facebook_link}
                      icon={"/assets/icons/social/fb.svg"}
                    />
                    <SocialIcon
                      href={settings.instagram_link}
                      icon={"/assets/icons/social/instagram.svg"}
                    />
                    <SocialIcon
                      href={settings.youtube_link}
                      icon={"/assets/icons/social/YouTube.svg"}
                    />
                    <SocialIcon
                      href={`https://wa.me/${settings?.whatsapp_link}` || "/"}
                      icon={"/assets/icons/social/whatsapp.png"}
                      // iconclassName={"h-7 w-7"}
                    />
                    <SocialIcon
                      href={settings.twitter_link}
                      icon={"/assets/icons/social/twitter.svg"}
                    />
                    <SocialIcon
                      href={settings.linkedin_link}
                      icon={"/assets/icons/social/linkedin.svg"}
                    />
                    <SocialIcon
                      href={settings.tiktok_link}
                      icon={"/assets/icons/social/TikTok.svg"}
                    />
                    <SocialIcon
                      href={settings.pinterest_link}
                      icon={"/assets/icons/social/pinterest.svg"}
                    />
                  </div>
                </div>
                <div className="footer-links">
                  <p>{translations["payment-method"]}</p>
                  <div className="payment-methods flex items-center gap-6 h-6">
                    <Image
                      src="/assets/icons/payments/payment.png"
                      alt="Payment"
                      width={32}
                      height={23}
                    />
                    <Image
                      src="/assets/icons/payments/bkash.png"
                      alt="Bkash"
                      width={32}
                      height={23}
                    />
                    <Image
                      src="/assets/icons/payments/visa.png"
                      alt="visa"
                      width={52}
                      height={23}
                    />
                    <Image
                      src="/assets/icons/payments/mastercard.svg"
                      alt="Bkash"
                      width={32}
                      height={23}
                    />
                    <Image
                      src="/assets/icons/payments/apple-pay.svg"
                      alt="Bkash"
                      width={32}
                      height={23}
                    />
                    <Image
                      src="/assets/icons/payments/google-pay.svg"
                      alt="Bkash"
                      width={32}
                      height={23}
                    />
                    <p className="!text-xs/[100%] !mb-0 text-white w-1/5">
                      {translations["many-more"] || "Many More"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="z-50 fixed right-5 bottom-5 rounded-full shadow-lg cursor-pointer">
          <Link
            target="_blank"
            href={`https://wa.me/${settings?.whatsapp_link}` || "/"}
          >
            <Image
              src={"/assets/icons/social/whatsapp.png"}
              alt="whatsapp"
              width={45}
              height={45}
            />
          </Link>
        </div>
        <div className="footer-bottom border-t border-slate-700 py-5">
          <div className="container">
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <div className="flex flex-wrap justify-center items-center text-sm font-normal font-body text-slate-400 text-center gap-2">
                  <span>
                    {translations["copyright"]} {new Date().getFullYear()}{" "}
                    {translations["copyright-msg"] || "All Rights Reserved "} By
                    <Link
                      href="/"
                      className="ml-1 text-slate-300 hover:underline"
                    >
                      {settings?.name}
                    </Link>
                  </span>

                  <span className="">|</span>

                  <div className="flex items-center gap-1">
                    <span>Developed By</span>
                    <Link
                      href="https://amarsolution.com/"
                      target="_blank"
                      className="text-slate-300 hover:underline"
                    >
                      <Image
                        src={amarsolutionLogo}
                        alt="logo"
                        width={117}
                        height={42}
                        className="mt-1 cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
