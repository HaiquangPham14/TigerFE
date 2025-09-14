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
        className="
          absolute left-0 w-full px-4 sm:px-6 flex flex-col items-center pointer-events-auto
          max-h-screen
        "
        // Khung giãn từ 60dvh tới cách đáy 10dvh + chiều cao footer (mặc định 64px)
        style={{ top: "60dvh", bottom: "calc(10dvh + var(--footer-h, 64px))" }}
      >
        {/* Tiêu đề: dùng vmin để co theo chiều nhỏ hơn */}
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/B%E1%BA%A0N%20%C4%90%C3%83%20%C4%90%E1%BB%A6%2018%20TU%E1%BB%94I_.png"
          alt="Bạn đã đủ 18 tuổi"
          className="
            mb-4 h-auto pointer-events-none
          "
          style={{
            // rộng tối thiểu 36vw (hoặc 36vh nếu chiều cao nhỏ hơn), tối đa 96 (tailwind lg:w-96 tương đương),
            // và không nhỏ hơn 160px để giữ đọc được
            width: "clamp(160px, 36vmin, 384px)",
          }}
        />

        {/* Hai nút */}
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
              className="select-none h-auto"
              style={{
                // nút co theo vmin (1 lần) thay vì đo theo width/height riêng rẽ
                width: "clamp(96px, 22vmin, 208px)", // ~ w-24 → w-52 tương đương
              }}
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
              className={`transition select-none h-auto ${
                canContinue ? "" : "grayscale opacity-60 cursor-not-allowed"
              }`}
              style={{
                width: "clamp(96px, 22vmin, 208px)",
              }}
              draggable={false}
            />
          </button>
        </div>

        {/* Điều khoản: mt-auto để neo xuống đáy của khung giãn (cách đáy 10dvh, không đụng footer)
            Font-size dùng vmin -> co theo chiều nhỏ hơn (ngang/dọc) CHỈ 1 lần */}
        <div
          className="
            mt-auto w-[90%] sm:w-[80%] mx-auto leading-tight
            space-y-3 sm:space-y-4
          "
          style={{
            // cỡ chữ: không nhỏ hơn 9px, không lớn hơn 15px, và tỉ lệ dùng 2.6vmin
            fontSize: "clamp(9px, 2.6vmin, 15px)",
          }}
        >
          <label className="flex items-start gap-2 sm:gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree1}
              onChange={() => setAgree1(!agree1)}
              className="hidden"
            />
            {/* Kích thước checkbox theo em để tỉ lệ với font-size (co cùng 1 lần) */}
            <div
              className="flex-shrink-0 flex items-center justify-center bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: checkBg,
                width: "1.2em",
                height: "1.2em",
              }}
            >
              {agree1 && (
                <CheckCircle
                  className="text-green-400 drop-shadow"
                  style={{ width: "0.9em", height: "0.9em" }}
                />
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
              className="flex-shrink-0 flex items-center justify-center bg-center bg-contain bg-no-repeat"
              style={{
                backgroundImage: checkBg,
                width: "1.2em",
                height: "1.2em",
              }}
            >
              {agree2 && (
                <CheckCircle
                  className="text-green-400 drop-shadow"
                  style={{ width: "0.9em", height: "0.9em" }}
                />
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
