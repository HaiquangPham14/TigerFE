import { useNavigate } from "react-router-dom";
import { useEffect, useState, CSSProperties } from "react";

export default function Confirm() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);
    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  // ↓↓↓ CHỈ BỔ SUNG: làm nút responsive theo màn hình, vẫn giữ hành vi cũ
  const bottomOffsetMobile = "calc(env(safe-area-inset-bottom, 0px) + clamp(24px, 8vh, 72px))";
  const buttonWidth = isDesktop
    ? "clamp(220px, 20vw, 360px)"   // desktop: to/nhỏ theo chiều ngang
    : "clamp(180px, 42vw, 300px)";  // mobile: co giãn theo màn hình

  const buttonPosStyle: CSSProperties = isDesktop
    ? { top: "80%" }                   // giữ “kiểu cũ” desktop dùng top %
    : { bottom: bottomOffsetMobile };  // mobile bám đáy, chừa safe-area
  // ↑↑↑ HẾT PHẦN BỔ SUNG

  return (
    <div
      className="w-screen h-screen relative" // giữ nguyên
      style={{
        backgroundImage:
          "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/TicketLuckyDraw-004.png')",
        backgroundSize: isDesktop ? "contain" : "100% 100%", // desktop cũ + mobile 100% 100%
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: isDesktop ? "#102677" : "transparent",
      }}
    >
      {/* Nút Tiếp tục (giữ nguyên điều hướng, chỉ thêm responsive size/pos) */}
      <button
        onClick={() => navigate("/app")}
        className="absolute left-1/2 -translate-x-1/2"
        style={buttonPosStyle}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          style={{ width: buttonWidth, height: "auto" }}  // responsive kích thước
          className="hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Overlay khi xoay ngang (giữ nguyên logic cũ) */}
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
      