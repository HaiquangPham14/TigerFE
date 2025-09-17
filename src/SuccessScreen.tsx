// SuccessScreen.tsx
import React from "react";

export function SuccessScreen() {
  // Nền giữ đúng 100% x 100% như hiện tại
  const IMG =
    "https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/323%20(1).png";

  // Đường dẫn 5 GIF (đặt trong public/animations/)
  // Đổi tên/đường dẫn cho khớp file của bạn nếu khác
  const G1 = "https://www.tigerstreetfootball2025.vn/animations/phao-1.gif";
  const G2 = "https://www.tigerstreetfootball2025.vn/animations/phao-2.gif";
  const G3 = "https://www.tigerstreetfootball2025.vn/animations/phao-3.gif";
  const G4 = "https://www.tigerstreetfootball2025.vn/animations/phao-4.gif";
  const G5 = "https://www.tigerstreetfootball2025.vn/animations/phao-5.gif";

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url("${IMG}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%", // giữ yêu cầu 100% x 100%
      }}
    >
      {/* 5 GIF pháo hoa - vị trí cố định, không chặn click */}
      <div className="pointer-events-none absolute inset-0 z-10 motion-reduce:hidden">
        {/* Trên trái */}
        <img
          src={G4}
          alt=""
          loading="eager"
          aria-hidden="true"
          className="absolute left-[20%] w-[30vw] max-w-[400px] h-auto select-none"
        />
        {/* Trên phải */}
        <img
          src={G3}
          alt=""
          className="absolute left-[60%] top-[32%] w-[50vw] max-w-[500px] h-auto select-none"
        />
        {/* Trên giữa */}
        <img
          src={G3}
          alt=""
          className="absolute left-[60%] -translate-x-1/2 top-[10%] w-[30vw] max-w-[400px] h-auto select-none"
        />
        {/* Dưới trái */}
        <img
          src={G4}
          alt=""
          className="absolute bottom-[25%] w-[40vw] max-w-[400px] h-auto select-none"
        />
        {/* Dưới phải */}
        <img
          src={G5}
          alt=""
          className="absolute left-[65%] bottom-[22%] w-[30vw] max-w-[400px] h-auto select-none"
        />
      </div>

      {/* Nếu có nội dung khác của màn success thì giữ ở đây */}
      <div className="relative z-20">
        {/* ... */}
      </div>
    </div>
  );
}
