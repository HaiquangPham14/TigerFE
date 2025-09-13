import { useNavigate } from "react-router-dom";
import { useEffect, useState, CSSProperties } from "react";

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

  // Khoá cuộn chỉ trên mobile để nền không trượt; desktop giữ nguyên
  useEffect(() => {
    document.documentElement.style.overflow = isDesktop ? "" : "hidden";
    document.body.style.overflow = isDesktop ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isDesktop]);

  const buttonPosStyle: CSSProperties = isDesktop
    ? { top: "80%" } // Desktop: vị trí nút như cũ
    : { bottom: "calc(env(safe-area-inset-bottom, 0px) + 8vh)" }; // Mobile: bám đáy, chừa safe-area

  return (
    <div
      className="fixed inset-0"
      style={{
        width: "100vw",
        height: "100dvh", // ổn định hơn 100vh trên mobile
        backgroundImage:
          "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/TicketLuckyDraw-004.png')",
        backgroundSize: isDesktop ? "contain" : "100% 100%", // Desktop = contain (cũ), Mobile = 100% 100%
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: isDesktop ? "#102677" : "transparent", // Desktop nền xanh như cũ
        overscrollBehavior: "none",
        touchAction: "manipulation",
      }}
    >
      {/* Nút Tiếp tục */}
      <button
        onClick={() => navigate("/app")}
        className="absolute left-1/2 -translate-x-1/2"
        style={buttonPosStyle}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          className="w-40 md:w-56 hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Overlay khi xoay ngang (chỉ mobile) */}
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
