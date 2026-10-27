"use client";
import React, { useEffect, useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebookF,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import type { IconType } from "react-icons";
import type { Translations } from "@/types";

interface ShareButtonProps {
  /** One of the react-share buttons (FacebookShareButton, TwitterShareButton, ...) */
  ButtonComponent: React.ElementType;
  IconComponent: IconType;
  url: string;
  color: string;
}

const ShareButton = ({ ButtonComponent, IconComponent, url, color }: ShareButtonProps) => (
  <ButtonComponent url={url} className="flex flex-col md:flex-row items-center mr-2 gap-3 my-3 ">
    <div className="rounded-full w-[30px] h-[30px] flex justify-center items-center bg-slate-50 hover:bg-hovercolor">
      <IconComponent size={18} color={color} />
    </div>
  </ButtonComponent>
);

export default function SocialShare({ translations = {} }: { translations?: Translations }) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div className="flex items-center">
      <h3 className="font-semibold whitespace-nowrap mr-2">
        {translations["share"] || "Share"}:
      </h3>
      <div className="flex items-center justify-start w-full lg:px-4">
        <ShareButton ButtonComponent={FacebookShareButton} IconComponent={FaFacebookF} url={currentUrl} color="#3b5998" />
        <ShareButton ButtonComponent={TwitterShareButton} IconComponent={FaTwitter} url={currentUrl} color="#00acee" />
        <ShareButton ButtonComponent={EmailShareButton} IconComponent={MdOutlineEmail} url={currentUrl} color="#D44638" />
        <ShareButton ButtonComponent={LinkedinShareButton} IconComponent={FaLinkedin} url={currentUrl} color="#0e76a8" />
        <ShareButton ButtonComponent={PinterestShareButton} IconComponent={FaPinterest} url={currentUrl} color="#E60023" />
        <ShareButton ButtonComponent={WhatsappShareButton} IconComponent={FaWhatsapp} url={currentUrl} color="#1daa61" />
      </div>
    </div>
  );
}
