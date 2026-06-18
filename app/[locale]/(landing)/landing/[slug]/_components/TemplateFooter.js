
import { fetchData } from "@/lib/fetch-data";
import Link from "next/link";
import { GoPaperclip } from "react-icons/go";

const TemplateFooter = async ({ images, max }) => {
    const [settingsRes] = await Promise.allSettled([
      fetchData({ api: `info/basic` }),
    ]);
  
    const settings =
      settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  return (
    <div className="w-full bg-gray-900 h-20 text-white text-sm py-6">
      <div className="flex justify-center items-center gap-3">
        <Link href="/">
          <div className="flex gap-2">
            <div>
              <GoPaperclip />
            </div>
            <div className="font-hind">Privacy Policy</div>
          </div>
        </Link>

        <Link href="/">
          <div className="flex gap-2">
            <div>
              <GoPaperclip />
            </div>
            <div className="font-hind">Refund Policy</div>
          </div>
        </Link>

        <Link href="/">
          <div className="flex gap-2">
            <div>
              <GoPaperclip />
            </div>

            <div className="font-hind">Terms & Conditions</div>
          </div>
        </Link>
      </div>
      <div className="text-center mt-[1px]">
        <h2 className="text-sm font-hind">
          © {new Date().getFullYear()} - {settings?.name} | All rights reserved | Developed by AmarSolution
        </h2>
      </div>
    </div>
  );
};

export default TemplateFooter;
