import Modal from "@/components/elements/Modal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React from "react";
import { useSelector } from "react-redux";

const ReviewInstruction = ({ isActive, setIsActive }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { translations } = useSelector((state) => state.common);
    const pageContent = (
        <div className="text-[#334155] ltr:ml-2 rtl:mr-2">
            <div>
                <h3 className="font-semibold text-4">
                    {translations["necessary-steps"] || "Necessary Steps"}:
                </h3>
                <ul className="list-outside list-disc whitespace-pre-line ml-6 leading-7 mt-1">
                    <li>
                        {translations["focus-on-product"] || "Focus only on the product and its features."}
                    </li>
                    <li>
                        {translations["discuss-about-the-product"] || "Review based on your own personal experience."}
                    </li>
                    <li>
                        {translations["review-feeling"] || "Tell us why you feel a certain way about it."}
                    </li>
                </ul>
            </div>
            <div className="mt-6 ">
                <h3 className="font-semibold text-4">
                    {translations["what-not-to-do"] || "What Not to Do"}:
                </h3>
                <ul className="list-outside list-disc whitespace-pre-line ml-6 leading-7 mt-1">
                    <li>
                        {translations["dont-share"] || "Do not share anything irrelevant to the product."}
                    </li>
                    <li className="">
                        {translations["dont-mislead"] || "Do not include deceptive, false, misleading, or fraudulent information."}
                    </li>
                    <li>
                        {translations["use-good-language"] || "Do not use obscene, defamatory, threatening, or discriminatory language."}
                    </li>
                    <li>
                        {translations["dont-share-other-info"] || "Do not share anyone's personal information."}
                    </li>
                    <li>
                        {translations["unauthorized-tread-mark"] || "Do not include unauthorized trademark or copyrighted material."}
                    </li>
                </ul>
            </div>
        </div>
    );

    return isMobile ? (
        <Modal
            showModal={isActive}
            setShowModal={setIsActive}
            // title={translations["select-variant"] || "Select Variant"}
            class
        >
            {pageContent}
        </Modal>
    ) : (
        <div className="p-6 w-[578px] shadow-top text-[#334155] absolute ltr:right-[-40px] rtl:left-[-10px] top-10 rounded-xl bg-white">
            <div className="absolute top-0 ltr:right-6 rtl:left-6 -z-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-6 h-6 bg-white"></div>
            {pageContent}
        </div>
    );
};

export default ReviewInstruction;
