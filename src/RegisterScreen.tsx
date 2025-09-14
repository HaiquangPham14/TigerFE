import { useEffect, useMemo, useRef, useState } from "react";
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

  // refs cho 2 ô nền để đo chiều cao thực tế
  const nameWrapRef = useRef<HTMLDivElement | null>(null);
  const phoneWrapRef = useRef<HTMLDivElement | null>(null);

  // đo & set biến --fieldH theo chiều cao container, cập nhật khi resize
  useEffect(() => {
    const els = [nameWrapRef.current, phoneWrapRef.current].filter(
      (x): x is HTMLDivElement => !!x
    );

    const update = () => {
      for (const el of els) {
        const h = el.clientHeight; // px
        el.style.setProperty("--fieldH", `${h}px`);
      }
    };

    // chạy ngay
    update();

    // ResizeObserver cho mượt
    const ro = "ResizeObserver" in window ? new ResizeObserver(update) : null;
    ro && els.forEach((el) => ro.observe(el));
    window.addEventListener("resize", update);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const nameValid = fullName.trim().length >= 8;
  const phoneTrim = phone.trim();
  const phoneValid = /^0\d{9}$/.test(phoneTrim);
  const canSubmit = nameValid && phoneValid && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameValid) return onError("Tên không hợp lệ (ít nhất 8 ký tự).");
    if (!phoneValid)
      return onError("Số điện thoại không hợp lệ (10 số bắt đầu 0).");

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

  // ảnh nền ô điền
  const fieldBg =
    "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/HotenSDT.png')";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="font-barlow absolute left-1/2 -translate-x-1/2 text-white space-y-5 sm:space-y-6"
        style={{ top: "60dvh", width: "80%" }}
      >
        {/* Họ và tên */}
        <div>
          <div
            ref={nameWrapRef}
            className="relative w-[80%] bg-no-repeat bg-center bg-contain mx-auto" // giảm chiều rộng còn 80%
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
              style={{ fontSize: "calc(var(--fieldH) * 0.35)" }} // ✅ nhỏ hơn 30%
              autoComplete="name"
            />
          </div>
          {!nameValid && fullName.length > 0 && (
            <p className="mt-1 text-xs sm:text-sm text-red-300">
              Tên không hợp lệ (ít nhất 8 ký tự).
            </p>
          )}
        </div>

        {/* Số điện thoại */}
        <div>
          <div
            ref={phoneWrapRef}
            className="relative w-[80%] bg-no-repeat bg-center bg-contain mx-auto" // giảm chiều rộng còn 80%
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
              style={{ fontSize: "calc(var(--fieldH) * 0.35)" }} // ✅ nhỏ hơn 30%
              autoComplete="tel"
            />
          </div>
          {!phoneValid && phone.length > 0 && (
            <p className="mt-1 text-xs sm:text-sm text-red-300">
              Số điện thoại không hợp lệ (10 số bắt đầu 0).
            </p>
          )}
        </div>

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center"
          title={canSubmit ? "Xác nhận tham gia" : "Vui lòng nhập đủ thông tin hợp lệ"}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/Gui.png"
            alt="Xác nhận tham gia"
            className={`h-auto select-none transition
               w-28 sm:w-40 md:w-44 lg:w-52   // ✅ nhỏ hơn 30%
               ${canSubmit ? "hover:scale-105" : "grayscale opacity-60 cursor-not-allowed"}`}
            draggable={false}
          />
        </button>
      </form>

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