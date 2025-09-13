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

    // Khóa cuộn khi đứng ở trang này (mobile), desktop để nguyên
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    if (!isDesktop) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
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
        backgroundSize: isDesktop ? "contain" : "100% 100%",  // desktop = contain, mobile = 100% 100%
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: isDesktop ? "#102677" : "transparent", // desktop nền xanh
        overscrollBehavior: "none",
        touchAction: "manipulation",
      }}
    >
      {/* Nút Tiếp tục: giữ logic điều hướng, neo đáy có safe-area */}
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

      {/* Overlay xoay ngang: chỉ hiện trên mobile */}
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
