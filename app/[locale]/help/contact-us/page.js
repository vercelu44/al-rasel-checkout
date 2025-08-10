import Link from "next/link";

// ** Import Icons
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
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
			<div className="breadcrumb breadcrumb-2 py-5">
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
							<h1>Contact Us</h1> 
						</Link>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="contact-us mb-20">
					<div className="heading border-b border-slate-200 py-4 mb-6">
						<h3 className="text-3xl font-thin font-title text-slate-900">
							Contact Us
						</h3>
					</div>
					<div className="contact-wpr grid lg:grid-cols-2 items-center gap-12">
						<div className="address basis-2/5">
							<ul className="info-list">
								<li className="flex items-start gap-2 mb-4">
									<FaMapMarkerAlt size={20} />
									<p className="pr-4">{settings.address}</p>
								</li>
								<li className="flex items-center flex-wrap gap-2 mb-4">
									<BsFillTelephoneFill ize={16} />
									{settings?.phone?.map((e, index) => (
										<Link key={index} href={`tel:${settings?.phone[index]}`}>
											{`${settings?.phone[index]}${
												index + 1 < settings.phone.length ? "," : ""
											}`}
										</Link>
									))}
								</li>
								<li className="flex items-center flex-wrap gap-2 mb-4">
									<FaEnvelope ize={16} />
									{settings?.email?.map((e, index) => (
										<Link key={index} href={`mailto:${settings?.email[index]}`}>
											{`${settings?.email[index]}${
												index + 1 < settings.email.length ? "," : ""
											}`}
										</Link>
									))}
								</li>
							</ul>
							<div className="[&>div>iframe]:w-full">
								<ViewHTML htmlText={settings.google_map_link} />
							</div>
						</div>
						<div className="bg-slate-200 p-6">
							<ContactForm />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ContactUs;
