"use client";

import { FaComments, FaUser, FaLightbulb, FaTrophy } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

const QualityStandard = () => {
  const qualityFeatures = [
    {
      icon: FaComments,
      title: "Exchange",
      description:
        "Thanks to a constant exchange with our customers, our developers can react promptly to the needs of the market.",
    },
    {
      icon: FaUser,
      title: "Innovation",
      description:
        "We invest in clever minds: the ideas and suggestions of our employees are our innovation pool.",
    },
    {
      icon: FaLightbulb,
      title: "Performance",
      description:
        "Our agile approach means we can always adapt flexibly and respond quickly and efficiently to new market conditions.",
    },
    {
      icon: FaTrophy,
      title: "Quality",
      description:
        "All domestic and foreign production sites work according to the same total quality management system.",
    },
  ];

  return (
    <div className=" bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-12 sm:mb-16">
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
            Our products have received multiple awards for their quality
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our quality standards
          </h1>
          <div className="w-16 h-1 bg-[#1B5A8E]"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
          {qualityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex flex-col">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1B5A8E] flex items-center justify-center mb-5 sm:mb-6">
                  <IconComponent className="text-white text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div>
          <button className="inline-flex items-center gap-3 bg-[#1B5A8E] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium hover:bg-[#164a75] transition-colors duration-200">
            Our Management System Certification
            <MdArrowForward className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityStandard;
