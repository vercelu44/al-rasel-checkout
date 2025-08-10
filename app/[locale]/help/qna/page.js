import Link from "next/link";

// ** Imoprt icons
import QNAItems from "@/components/QNAItems";

const QnA = () => {
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
              href={`/help/qna`}
              className="text-base text-slate-900 hover:text-secondary"
            >
             <h1>QnA</h1> 
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="qna mb-20">
          <div className="heading border-b border-slate-200 py-4 mb-6">
            <h3 className="text-3xl font-thin font-title text-slate-900">
              Questions and Answers
            </h3>
          </div>
          <QNAItems />
        </div>
        {/* <div className="contact border-t border-slate-200 py-5 text-center mb-10">
          <p className="flex justify-center items-center gap-5 bg-amber-200 border border-primary rounded-xl p-4">
            <span className="text-xl font-bold font-title text-slate-900">
              যে কোন জিজ্ঞাসা বা অর্ডার করতে আমাদের কল করুন:
            </span>{" "}
            <Link
              href="tel:01720060958"
              className="text-xl font-bold font-title text-primary"
            >
              <BsFillTelephoneFill /> 01720060958
            </Link>{" "}
            <span className="text-sm text-slate-500">অথবা</span>{" "}
            <Link
              href="tel:01720060977"
              className="text-xl font-bold font-title text-primary"
            >
              <BsFillTelephoneFill /> 01720060977
            </Link>
          </p>
        </div> */}
      </div>
    </>
  );
};

export default QnA;
