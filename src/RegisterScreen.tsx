import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const API_BASE = "https://tigerbeer2025.azurewebsites.net/api";

async function postJson(path: string, data: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const ct = res.headers.get("content-type") || "";
  const payload = ct.includes("application/json") ? await res.json() : null;
  if (!res.ok) {
    const message = (payload && (payload.message || payload.error)) || res.statusText;
    const err: any = new Error(message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return payload;
}

export function RegisterScreen({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // nhóm "2 input" sẽ được dịch bằng translateY để luôn nằm sát bàn phím khi focus
  const fieldsWrapRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [shiftY, setShiftY] = useState(0); // px từ vị trí gốc

  // đo chiều cao khung nền mỗi field để scale font-size tương ứng
  const nameWrapRef = useRef<HTMLDivElement | null>(null);
  const phoneWrapRef = useRef<HTMLDivElement | null>(null);

  // cập nhật --fieldH theo chiều cao khung nền (để font-size theo ảnh)
  useEffect(() => {
    const els = [nameWrapRef.current, phoneWrapRef.current].filter(
      (x): x is HTMLDivElement => !!x
    );
    const update = () => {
      for (const el of els) el.style.setProperty("--fieldH", `${el.clientHeight}px`);
    };
    update();
    const ro = "ResizeObserver" in window ? new ResizeObserver(update) : null;
    ro && els.forEach((el) => ro.observe(el));
    window.addEventListener("resize", update);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Đẩy input đang focus lên "sát bàn phím" (end)
  const stickActiveInputToKeyboard = (target?: HTMLElement) => {
    const el = target ?? (document.activeElement as HTMLElement | null);
    if (!el || !formRef.current) return;
    if (!formRef.current.contains(el)) return;

    // visual viewport hiện tại
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const vvTop = vv ? vv.offsetTop : 0;
    const vvH = vv ? vv.height : window.innerHeight;

    // mép trên của bàn phím ≈ đáy vùng nhìn thấy
    const keyboardTop = vvTop + vvH;

    // cần đặt "đáy" của field cách mép trên bàn phím một khoảng GAP
    const GAP = 8;
    const rect = el.getBoundingClientRect();
    const currentBottom = rect.bottom;
    const desiredBottom = keyboardTop - GAP;

    // delta > 0 nghĩa là field đang thấp (bị che) → kéo lên
    // delta < 0 nghĩa là field đang cao quá → kéo xuống cho "sát" bàn phím
    const delta = currentBottom - desiredBottom;

    setShiftY((prev) => prev - delta);
  };

  // focus/blur
  useEffect(() => {
    const onFocus = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const tag = (el.tagName || "").toLowerCase();
      if (tag !== "input" && tag !== "textarea" && !el.isContentEditable) return;
      setTimeout(() => stickActiveInputToKeyboard(el), 60); // chờ bàn phím mở xong
    };

    const onBlur = () => {
      // nếu không còn focus trong form → trả về vị trí gốc
      setTimeout(() => {
        const ae = document.activeElement as HTMLElement | null;
        if (!formRef.current) return;
        if (!ae || !formRef.current.contains(ae)) setShiftY(0);
      }, 60);
    };

    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  // khi visual viewport thay đổi (mở/đóng/di chuyển bàn phím) → giữ field đang nhập "sát" bàn phím
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    const rebalance = () => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && formRef.current?.contains(ae)) stickActiveInputToKeyboard(ae);
    };
    vv.addEventListener("resize", rebalance);
    vv.addEventListener("scroll", rebalance);
    return () => {
      vv.removeEventListener("resize", rebalance);
      vv.removeEventListener("scroll", rebalance);
    };
  }, []);

  const nameValid = fullName.trim().length >= 8;
  const phoneTrim = phone.trim();
  const phoneValid = /^0\d{9}$/.test(phoneTrim) || /^\+84\d{9}$/.test(phoneTrim);
  const canSubmit = nameValid && phoneValid && !loading;

  async function trySubmit() {
    if (!nameValid) return onError("Tên không hợp lệ (ít nhất 8 ký tự).");
    if (!phoneValid)
      return onError("Số điện thoại không hợp lệ (10 số bắt đầu 0 hoặc 12 ký tự bắt đầu +84).");

    setLoading(true);
    try {
      await postJson("/TigerCustomers/verify-and-register", {
        fullName: fullName.trim(),
        phoneNumber: phoneTrim,
      });
      onSuccess();
    } catch (err: any) {
      onError(err?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void trySubmit();
  }

  // nền của ô nhập theo thiết kế
  const fieldBg =
    "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/HotenSDT.png')";

  return (
    <>
      {/* Cụm 2 input: cố định theo hình; khi focus sẽ dịch theo shiftY để nằm sát bàn phím */}
      <div
        ref={fieldsWrapRef}
        className="absolute w-full"
        style={{
          top: "60dvh", // vị trí gốc theo hình (chỉnh nếu cần)
          left: 0,
          right: 0,
          transform: `translateY(${shiftY}px)`,
          transition: "transform 220ms ease",
          willChange: "transform",
        }}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="font-barlow mx-auto text-white space-y-5 sm:space-y-6"
          style={{ width: "80%" }}
        >
          {/* HỌ VÀ TÊN */}
          <div>
            <div
              ref={nameWrapRef}
              className="relative w-full bg-no-repeat bg-center bg-contain mx-auto"
              style={{ backgroundImage: fieldBg }}
            >
              <div className="pt-[20%] sm:pt-[18%] md:pt-[16%]" />
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="HỌ VÀ TÊN"
                className="font-bold uppercase [&::placeholder]:font-normal
                           absolute inset-0 w-[80%] mx-auto h-full bg-transparent outline-none border-none
                           text-white placeholder-white/70 text-center leading-none"
                style={{ fontSize: "calc(var(--fieldH) * 0.5)" } as React.CSSProperties}
                autoComplete="name"
              />
            </div>
            {!nameValid && fullName.length > 0 && (
              <p className="mt-1 text-xs sm:text-sm text-red-300">
                Tên không hợp lệ (ít nhất 8 ký tự).
              </p>
            )}
          </div>

          {/* SỐ ĐIỆN THOẠI */}
          <div>
            <div
              ref={phoneWrapRef}
              className="relative w-full bg-no-repeat bg-center bg-contain mx-auto"
              style={{ backgroundImage: fieldBg }}
            >
              <div className="pt-[20%] sm:pt-[18%] md:pt-[16%]" />
              <input
                id="phone"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="SỐ ĐIỆN THOẠI"
                className="font-bold uppercase [&::placeholder]:font-normal
                           absolute inset-0 w-[80%] mx-auto h-full bg-transparent outline-none border-none
                           text-white placeholder-white/70 text-center leading-none"
                style={{ fontSize: "calc(var(--fieldH) * 0.5)" } as React.CSSProperties}
                autoComplete="tel"
              />
            </div>
            {!phoneValid && phone.length > 0 && (
              <p className="mt-1 text-xs sm:text-sm text-red-300">
                Số điện thoại không hợp lệ (10 số bắt đầu 0 hoặc 12 ký tự bắt đầu +84).
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Nút GỬI: cố định riêng theo hình, không dịch theo shiftY */}
      <div
        className="absolute left-1/2"
        style={{ top: "82dvh", transform: "translateX(-50%)" }}
      >
        <button
          onClick={trySubmit}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center"
          title={canSubmit ? "Xác nhận tham gia" : "Vui lòng nhập đủ thông tin hợp lệ"}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Gui.png"
            alt="Xác nhận tham gia"
            className={`h-auto select-none transition
                       w-40 sm:w-56 md:w-64 lg:w-72
                       ${canSubmit ? "hover:scale-105" : "grayscale opacity-60 cursor-not-allowed"}`}
            draggable={false}
          />
        </button>
      </div>

      {/* Overlay Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
          <Loader2 className="w-12 h-12 animate-spin text-white" />
          <span className="mt-4 text-lg font-semibold text-white">Đang gửi…</span>
        </div>
      )}
    </>
  );
}
