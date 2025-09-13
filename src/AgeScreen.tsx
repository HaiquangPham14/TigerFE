import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export function AgeScreen({
  onOk,
  onBack,
}: {
  onOk: () => void;
  onBack?: () => void; // cho phép optional
}) {
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const navigate = useNavigate(); // <<<<<< THÊM DÒNG NÀY

  const canContinue = agree1 && agree2;

  const checkBg =
    "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/nutttren.png')";

  const handleBack = () => {
    if (onBack) onBack();
    else navigate("/"); // fallback: quay về trang Confirm
  };

  return (
    // Tăng z-index để luôn nằm trên mọi overlay/background
    <div className="fixed inset-0 text-white overflow-hidden z-50">
      <div
        className="absolute left-0 w-full px-4 sm:px-6 flex flex-col items-center pointer-events-auto"
        style={{ top: "60svh" }}
      >
        {/* Ảnh banner phía trên nút */}
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/B%E1%BA%A0N%20%C4%90%C3%83%20%C4%90%E1%BB%A6%2018%20TU%E1%BB%94I_.png"
          alt="Bạn đã đủ 18 tuổi"
          className="mb-4 w-48 sm:w-64 md:w-80 lg:w-96 h-auto pointer-events-none"
        />

        {/* Hàng nút Back + Tiếp tục */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Back */}
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
              onClick={handleBack} // click trực tiếp trên ảnh
              draggable={false}
            />
          </button>

          {/* Continue */}
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

        {/* Điều khoản */}
        <div className="space-y-5 w-[85%] sm:w-[80%] mx-auto text-xs sm:text-sm md:text-base lg:text-lg">
          {/* Điều khoản 1 */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree1}
              onChange={() => setAgree1(!agree1)}
              className="hidden"
            />
            <div
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                         flex items-center justify-center bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: checkBg }}
            >
              {agree1 && (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-400 drop-shadow" />
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

          {/* Điều khoản 2 */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree2}
              onChange={() => setAgree2(!agree2)}
              className="hidden"
            />
            <div
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                         flex items-center justify-center bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: checkBg }}
            >
              {agree2 && (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-400 drop-shadow" />
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
