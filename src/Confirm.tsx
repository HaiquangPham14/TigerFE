import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Confirm() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // ---- Responsive flags + bảo đảm trang CHO PHÉP SCROLL ----
  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    // Mở scroll cho toàn trang trong thời gian ở màn này
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <>
      {/* LỚP NỀN CỐ ĐỊNH: không chặn tương tác/scroll */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          height: "100dvh",
          width: "100vw",
          backgroundImage:
            "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/TicketLuckyDraw-004.png')",
          backgroundSize: isDesktop ? "contain" : "100% 100%", // desktop = contain, mobile = 100% 100%
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: isDesktop ? "#102677" : "transparent", // desktop nền xanh
          touchAction: "manipulation",
        }}
      />

      {/* LỚP NỘI DUNG: cho phép SCROLL */}
      <div className="relative min-h-[100dvh] overflow-x-hidden">
        {/* Nội dung demo chiều cao để bạn cuộn nếu muốn */}
        <div className="mx-auto max-w-xl px-4 pt-10 pb-40 space-y-6 text-white">
          <h1 className="text-2xl font-bold drop-shadow-md text-center">
            Xác nhận tham gia
          </h1>
          <p className="opacity-90 drop-shadow">
            Nền phía sau cố định (fixed), nội dung phía trên có thể cuộn tự do. Nút
            “Tiếp tục” sẽ được neo ở cuối màn hình và không chặn cuộn.
          </p>
          <div className="h-[120dvh]" />
        </div>
      </div>

      {/* NÚT TIẾP TỤC: neo đáy, không chặn scroll nhờ pointer-events */}
      <div className="fixed inset-x-0 pointer-events-none z-10">
        <button
          onClick={() => navigate("/app")}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 8dvh)" }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
            alt="Tiếp tục"
            className="w-40 md:w-56 hover:scale-105 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Overlay xoay ngang: chỉ hiện trên mobile */}
      {isLandscape && !isDesktop && (
        <div className="fixed inset-0 bg-[#102677] flex items-center justify-center z-50">
          <p className="text-white text-lg font-bold text-center px-4">
            Vui lòng xoay dọc màn hình để tiếp tục
          </p>
        </div>
      )}
    </>
  );
}
