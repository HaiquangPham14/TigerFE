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

  // --- Responsive button: khoảng cách đáy & bề rộng co giãn theo màn hình ---
  // Bạn có thể tinh chỉnh các con số trong clamp() cho vừa mắt UI của bạn.
  const bottomOffset = isDesktop
    // Desktop: xa đáy hơn chút, co theo chiều cao viewport
    ? "calc(env(safe-area-inset-bottom, 0px) + clamp(40px, 7vh, 100px))"
    // Mobile: gần đáy hơn, nhưng vẫn co theo chiều cao
    : "calc(env(safe-area-inset-bottom, 0px) + clamp(24px, 8vh, 72px))";

  const buttonWidth = isDesktop
    // Desktop: nhỏ nhất 220px, thường ~20vw, tối đa 360px
    ? "clamp(220px, 20vw, 360px)"
    // Mobile: nhỏ nhất 180px, ~42vw, tối đa 300px
    : "clamp(180px, 42vw, 300px)";

  const buttonPosStyle: CSSProperties = {
    left: "50%",
    transform: "translateX(-50%)",
    bottom: bottomOffset,        // <-- luôn neo đáy, responsive
  };

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
      {/* Nút Tiếp tục (responsive vị trí & size) */}
      <button
        onClick={() => navigate("/app")}
        className="absolute"
        style={buttonPosStyle}
        aria-label="Tiếp tục"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          style={{ width: buttonWidth, height: "auto" }} // <-- responsive kích thước
          className="hover:scale-105 transition-transform duration-300"
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
