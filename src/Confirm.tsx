import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  return (
    <>
      {/* Nền cố định */}
      <div className="bg-hero-fixed" />

      {/* Lớp nội dung */}
      <div className="page-layer relative">
        {/* Nút Tiếp tục */}
        <button
          onClick={() => navigate("/app")}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "85%" }}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Tieptuc.png"
            alt="Tiếp tục"
            className="w-40 md:w-56 hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* Overlay khi xoay ngang */}
        {isLandscape && !isDesktop && (
          <div className="absolute inset-0 bg-[#102677] flex items-center justify-center z-50">
            <p className="text-white text-lg font-bold text-center px-4">
              Vui lòng xoay dọc màn hình để tiếp tục
            </p>
          </div>
        )}
      </div>
    </>
  );
}
