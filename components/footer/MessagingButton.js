"use client";

import { useState } from "react";
import { FaComments, FaTimes, FaFacebookMessenger } from "react-icons/fa";
import { BsWhatsapp, BsInstagram } from "react-icons/bs";
import { FaMessage } from "react-icons/fa6";
const MessagingButton = ({ settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messengerUser = settings?.facebook_link?.split("/")[3] || "no-user";
console.log(settings.whatsapp_link)
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed z-30 bottom-[75px] right-5 bg-[#e52027] text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        aria-label="Open messaging options"
      >
        <FaMessage  size={24} />
      </button>
      
      {/* Modal */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed bottom-[130px] right-5 bg-white rounded-2xl shadow-2xl z-50 w-80 p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">How can we help?</h3>
              <p className="text-sm text-gray-500 mt-1">Choose an option below</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Messenger Option */}
              {settings?.facebook_link && settings.facebook_link !== "#" && (
                <a
                  href={`https://m.me/${messengerUser}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <FaFacebookMessenger size={32} className="text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Messenger</span>
                </a>
              )}

              {settings?.whatsapp_link && settings.whatsapp_link !== "#" && (
                <a
                  href={settings.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                >
                  <BsWhatsapp size={32} className="text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Whatsapp</span>
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MessagingButton;