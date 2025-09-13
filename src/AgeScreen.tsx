import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export function AgeScreen({
  onOk,
  onBack,
}: {
  onOk: () => void;
  onBack?: () => void;
}) {
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const navigate = useNavigate();

  const canContinue = agree1 && agree2;

  const checkBg =
    "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/nutttren.png')";

  const handleBack = () => {
    if (onBack) onBack();
    else navigate("/");
  };

  return (
    <div className="absolute inset-0 text-white overflow-visible z-50">
      <div
        className="absolute left-0 w-full px-4 sm:px-6 flex flex-col items-center pointer-events-auto"
        style={{ top: "60vh" }}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/B%E1%BA%A0N%20%C4%90%C3%83%20%C4%90%E1%BB%A6%2018%20TU%E1%BB%94I_.png"
          alt="Bạn đã đủ 18 tuổi"
          className="mb-4 w-48 sm:w-64 md:w-80 lg:w-96 h-auto pointer-events-none"
        />

        {/* Hai nút giữ nguyên kích thước gốc */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="focus:outline-none relative z-10"
            title="Quay lại"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Chua.png"
              alt="Chưa đủ"
              className="w-28 sm:w-36 md:w-44 lg:w-52 h-auto select-none"
              onClick={handleBack}
              draggable={false}
            />
          </button>

          <button
            type="button"
            onClick={canContinue ? onOk : undefined}
            className="focus:outline-none relative z-10"
            title="Tiếp tục"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Roi.png"
              alt="Đủ tuổi"
              className={`w-28 sm:w-36 md:w-44 lg:w-52 h-auto transition select-none ${
                canContinue ? "" : "grayscale opacity-60 cursor-not-allowed"
              }`}
              onClick={canContinue ? onOk : undefined}
              draggable={false}
            />
          </button>
        </div>

        {/* Ô tích & điều khoản - giảm 30% + responsive */}
        <div className="space-y-3 sm:space-y-4 w-[90%] sm:w-[80%] mx-auto 
                        text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight">
          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree1}
              onChange={() => setAgree1(!agree1)}
              className="hidden"
            />
            <div
              className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                         flex items-center justify-center bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: checkBg }}
            >
              {agree1 && (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 drop-shadow" />
              )}
            </div>
            <span>
              Tôi đồng ý với{" "}
              <a
                href="https://docs.google.com/document/d/1dg6DK_tkj3g4L22l4ZVKPTzoMISyKdck/view"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-orange-300 hover:text-orange-400"
              >
                Thể lệ Chương trình
              </a>
            </span>
          </label>

          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree2}
              onChange={() => setAgree2(!agree2)}
              className="hidden"
            />
            <div
              className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                         flex items-center justify-center bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: checkBg }}
            >
              {agree2 && (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 drop-shadow" />
              )}
            </div>
            <span>
              Tôi đồng ý cho HEINEKEN Việt Nam xử lý các thông tin cá nhân của tôi
              cho mục đích tiếp thị, phân tích nội bộ, chăm sóc khách hàng và các
              mục đích khác: cụ thể xem chi tiết ở{" "}
              <a
                href="https://drive.google.com/file/d/1PLWW__Uou3TRZepxHFQK5PNvMYMm4Rnd/view"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-orange-300 hover:text-orange-400"
              >
                Thông báo quyền riêng tư và Điều khoản
              </a>
              .
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
