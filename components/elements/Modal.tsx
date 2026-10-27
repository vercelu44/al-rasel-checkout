import React from "react";
import useLockedBody from "@/hooks/useLockedBody";
import { RiCloseCircleFill } from "react-icons/ri";
import { useAppSelector } from "@/store/hooks";

export interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Show only the body (no header/padding); clicking the backdrop closes it. */
  bodyOnly?: boolean;
}

export default function Modal({
  showModal,
  setShowModal,
  title,
  children,
  bodyOnly = false,
}: ModalProps) {
  const { settings } = useAppSelector((state) => state.common);

  useLockedBody(showModal); // Lock the body when the drawer is open

  return (
    <>
      {showModal ? (
        <>
          {/* Backdrop */}
          <div
            onClick={() => bodyOnly && setShowModal(false)}
            className={`w-full h-full opacity-40 fixed z-40 inset-0 bg-black ${
              bodyOnly ? "cursor-pointer" : ""
            }`}
          ></div>
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
            <div
              className={`relative w-auto mx-auto ${
                bodyOnly ? "p-0" : "p-5"
              } max-w-5xl`}
            >
              {/*content*/}
              <div
                className={`relative flex flex-col w-full bg-white outline-none ${
                  bodyOnly ? "" : "rounded-lg shadow-md border-0"
                } overflow-hidden`}
              >
                {/* Close button */}
                <button
                  aria-label="Close"
                  className="absolute top-0 right-0 text-4xl p-2"
                  onClick={() => setShowModal(false)}
                >
                  <RiCloseCircleFill
                    className="text-3xl md:text-4xl"
                    style={{
                      color: bodyOnly
                        ? settings?.colors?.primary || "white"
                        : settings?.colors?.default_text,
                    }}
                  />
                </button>
                {/*header*/}
                {!bodyOnly && (
                  <div className="flex items-center justify-between px-2 md:px-5 py-3 md:py-3.5 mb-2">
                    <h3 className="text-[18px]/[28px] md:text-2xl font-title font-semibold text-slate-900 line-clamp-1">
                      {title ? title : null}
                    </h3>
                  </div>
                )}
                {/*body*/}
                <div
                  className={`${
                    bodyOnly ? "" : "px-3 md:px-6 pb-3 md:pb-6"
                  } overflow-y-auto max-h-[80vh]`}
                >
                  {children ? (
                    children
                  ) : (
                    <p className="text-slate-500 text-lg leading-relaxed">
                      This is a regular Modal, Pass Modal children to replace it
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
