import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Props = { onContinue?: () => void };
export default function Confirm({ onContinue }: Props) {
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

  return (
    // ✅ nền + chiều cao theo pattern mới (cho phép scroll)
    <div className="bg-confirm app-fixed min-w-[320px] relative overflow-x-hidden">
      {/* Nội dung khác nếu có... */}

      {/* Nút nhỏ hơn ~30% và dính đáy ảnh */}
      <button
        onClick={() => (onContinue ? onContinue() : navigate("/register"))}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 8vh)",
        }}
      >
        <img
          src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
          alt="Tiếp tục"
          className="w-36 md:w-52 hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Cảnh báo xoay dọc */}
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
