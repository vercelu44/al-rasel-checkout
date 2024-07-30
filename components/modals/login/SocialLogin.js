"use client";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { signIn, useSession } from "next-auth/react";

const SocialLogin = () => {
	const { translations } = useSelector((state) => state.common);

	return (
		<div className="social-login">
			<p className="pt-4 md:pt-7 pb-3 lg:pb-4">
				{translations["or-login"] || "Or login with"}:
			</p>
			<div className="flex justify-between items-center gap-x-3 font-semibold">
				<button onClick={() => signIn("google")} className="social-icon-btn">
					<Image
						src={"/assets/icons/social/google.png"}
						alt="google"
						height={24}
						width={24}
						sizes="100vh"
					/>
					<span>{translations["google"] || "Google"}</span>
				</button>
				<button onClick={() => signIn("facebook")} className="social-icon-btn">
					<Image
						src={"/assets/icons/social/facebook.png"}
						alt="facebook"
						height={24}
						width={24}
						sizes="100vh"
					/>
					<span>{translations["facebook"] || "Facebook"}</span>
				</button>
				{/*         <button className="social-icon-btn">
          <Image
            src={"/assets/icons/social/twitter.png"}
            alt="facebook"
            height={24}
            width={24}
            sizes="100vh"
          />
          <span>{translations["twitter"] || "টুইটার"}</span>
        </button> */}
			</div>
		</div>
	);
};

export default SocialLogin;
