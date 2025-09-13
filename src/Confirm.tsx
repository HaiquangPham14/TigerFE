import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Confirm() {
  const navigate = useNavigate();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    // Khóa cuộn khi đứng ở trang này (phòng body còn cuộn trên mobile)
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div
      /* Cố định toàn màn hình, dùng 100dvh để không bị nhảy khi mobile ẩn/hiện thanh URL */
      className="fixed inset-0"
      style={{
        height: "100dvh",                  // fallback mobile OK
        width: "100vw",
        backgroundImage:
          "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/TicketLuckyDraw-004.png')",
        backgroundSize: "100% 100%",       // giống background tổng “100 100”
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#102677",        // nền phòng hờ khoảng trống
        overscrollBehavior: "none",
        touchAction: "manipulation",
      }}
    >
      {/* Nút Tiếp tục: neo ở đáy, chừa safe-area để không bị che bởi thanh home iOS */}
      <button
        onClick={() => navigate("/app")}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        }}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          className="w-40 md:w-56 hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Overlay khi xoay ngang */}
      {isLandscape && (
        <div className="absolute inset-0 bg-[#102677] flex items-center justify-center z-50">
          <p className="text-white text-lg font-bold text-center px-4">
            Vui lòng xoay dọc màn hình để tiếp tục
          </p>
        </div>
      )}
    </div>
  );
}
