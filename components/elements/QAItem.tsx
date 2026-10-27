import { Collapse } from "react-collapse";

// ** Imoprt icons
import { HiOutlinePlusSm, HiOutlineMinusSm } from "react-icons/hi";
import ViewHTML from "./ViewHTML";

import type { QnaItem } from "@/types";

interface QAItemProps {
  /** The Q&A plus its position in the list */
  item: QnaItem & { index: number };
  open: boolean;
  toggleOpen: (index: number) => void;
}

const QAItem = ({ item, open, toggleOpen }: QAItemProps) => {
  return (
    <>
      <div
        className={`single-qna border ${
          open ? "border-primary" : "border-slate-200"
        } p-3 mb-4`}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleOpen(item.index)}
        >
          <h6 className="text-base/[16px] font-semibold font-title text-slate-600">
            {item.question}
          </h6>
          {open ? (
            <HiOutlineMinusSm size={24} className="text-primary" />
          ) : (
            <HiOutlinePlusSm size={24} className="text-primary" />
          )}
        </div>
        <Collapse isOpened={open}>
          <div className="mt-4">
            <ViewHTML htmlText={item.answer} />
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default QAItem;
