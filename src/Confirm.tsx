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

    // BỎ PHẦN KHÓA CUỘN - không cần nữa
    
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, [isDesktop]);

  return (
    <div
      className="fixed inset-0"
      style={{
        height: "100dvh",
        width: "100vw",
        backgroundImage:
          "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/TicketLuckyDraw-004.png')",
        backgroundSize: isDesktop ? "contain" : "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: isDesktop ? "#102677" : "transparent",
        overscrollBehavior: "none",
        touchAction: "manipulation",
      }}
    >
      <button
        onClick={() => navigate("/app")}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 8dvh)",
        }}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          className="w-40 md:w-56 hover:scale-105 transition-transform duration-300"
        />
      </button>

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