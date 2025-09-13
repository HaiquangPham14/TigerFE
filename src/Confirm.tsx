import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Confirm() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  const BG = "https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/TicketLuckyDraw-004.png";

  return (
    <div
      className="relative w-full min-h-screen overflow-y-auto"
      style={{
        backgroundImage: `url("${BG}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: isDesktop ? "contain" : "100% 100%",
        backgroundColor: isDesktop ? "#102677" : "transparent",
      }}
    >
      {/* Spacer để đảm bảo có chiều cao đủ hiển thị ảnh (và cho phép cuộn nếu cần) */}
      <div className="h-[100dvh]" />

      {/* Nút dính theo ảnh: absolute trong container (KHÔNG fixed nữa) */}
      <button
        onClick={() => navigate("/app")}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 8vh)",
        }}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          className="w-40 md:w-56 hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Cảnh báo xoay dọc (đi chung trong container) */}
      {isLandscape && !isDesktop && (
        <div className="absolute inset-0 bg-[#102677] flex items-center justify-center z-50">
          <p className="text-white text-lg font-bold text-center px-4">
            Vui lòng xoay dọc màn hình để tiếp tục
          </p>
        </div>
      )}
    </div>
  );
}
