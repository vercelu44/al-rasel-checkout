import Image from "next/image";
import React from "react";

const SocialLogin = () => {
  return (
    <div className="social-login">
      <p className="pt-7 pb-4 ">অথবা, লগ-ইন করুন:</p>
      <div className="flex justify-between items-center gap-3 font-bold">
        <button className="social-icon-btn">
          <Image
            src={"/assets/icons/social/facebook.png"}
            alt="facebook"
            height={24}
            width={24}
            sizes="100vh"
          />
          <span>ফেসবুক</span>
        </button>
        <button className="social-icon-btn">
          <Image
            src={"/assets/icons/social/google.png"}
            alt="facebook"
            height={24}
            width={24}
            sizes="100vh"
          />
          <span>গুগল</span>
        </button>
        <button className="social-icon-btn">
          <Image
            src={"/assets/icons/social/twitter.png"}
            alt="facebook"
            height={24}
            width={24}
            sizes="100vh"
          />
          <span>টুইটার</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
