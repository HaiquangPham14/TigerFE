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

  // đo chiều cao khung nền mỗi field để scale font-size tương ứng
  const nameWrapRef = useRef<HTMLDivElement | null>(null);
  const phoneWrapRef = useRef<HTMLDivElement | null>(null);

  // container cuộn chính
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // cập nhật --fieldH theo chiều cao khung nền
  useEffect(() => {
    const els = [nameWrapRef.current, phoneWrapRef.current].filter(
      (x): x is HTMLDivElement => !!x
    );
    const update = () => {
      for (const el of els) {
        const h = el.clientHeight;
        el.style.setProperty("--fieldH", `${h}px`);
      }
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

  // Tính chiều cao bàn phím và chiều cao visual viewport để thêm đệm cuộn
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;

    const applyInsets = () => {
      const kb = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      document.documentElement.style.setProperty("--kb", `${kb}px`);
      document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
      if (scrollRef.current) {
        scrollRef.current.style.paddingBottom = `calc(${kb}px + 16px)`;
        (scrollRef.current.style as any).height = `var(--vvh)`; // chiều cao theo visual viewport
      }
    };

    applyInsets();
    vv.addEventListener("resize", applyInsets);
    vv.addEventListener("scroll", applyInsets);
    return () => {
      vv.removeEventListener("resize", applyInsets);
      vv.removeEventListener("scroll", applyInsets);
    };
  }, []);

  // Khi focus input -> đặt ô nhập vào 50% chiều cao màn hình (center)
  useEffect(() => {
    const onFocus = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const tag = (el.tagName || "").toLowerCase();
      if (tag !== "input" && tag !== "textarea" && !el.isContentEditable) return;

      // chờ 1 nhịp cho bàn phím mở xong rồi mới cuộn
      setTimeout(() => {
        try {
          el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
        } catch {
          // Fallback thủ công nếu trình duyệt không hỗ trợ block:"center"
          const sc = scrollRef.current;
          if (!sc) return;
          const rect = el.getBoundingClientRect();
          const scRect = sc.getBoundingClientRect();

          // dùng visual viewport nếu có, để tính đúng 50% vùng còn lại
          const vv = (window as any).visualViewport as VisualViewport | undefined;
          const vvH = vv ? vv.height : scRect.height;
          const elCenter = rect.top + rect.height / 2;
          const targetCenter = (vv ? vv.offsetTop : scRect.top) + vvH * 0.5;

          const delta = elCenter - targetCenter;
          sc.scrollBy({ top: delta, behavior: "smooth" });
        }
      }, 60);
    };

    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
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

  const fieldBg =
    "url('https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/HotenSDT.png')";

  return (
    <>
      {/* Vùng scroll chính của form */}
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          // GIỮ NGUYÊN FONT CŨ
          className="font-barlow absolute left-1/2 -translate-x-1/2 text-white space-y-5 sm:space-y-6"
          style={{ top: "60vh", width: "80%" }}
        >
          {/* Họ và tên */}
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
                style={{
                  fontSize: "calc(var(--fieldH) * 0.5)",
                  scrollMarginBottom: "calc(var(--kb, 0px) + 16px)",
                } as React.CSSProperties}
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
                style={{
                  fontSize: "calc(var(--fieldH) * 0.5)",
                  scrollMarginBottom: "calc(var(--kb, 0px) + 16px)",
                } as React.CSSProperties}
                autoComplete="tel"
              />
            </div>
            {!phoneValid && phone.length > 0 && (
              <p className="mt-1 text-xs sm:text-sm text-red-300">
                Số điện thoại không hợp lệ (10 số bắt đầu 0 hoặc 12 ký tự bắt đầu +84).
              </p>
            )}
          </div>

          {/* spacer để nội dung dưới không bị che (tùy chọn) */}
          <div className="h-24" />
        </form>
      </div>

      {/* Nút Gửi cố định theo hình (căn giữa, ở ~82% chiều cao màn hình) */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "82dvh" }} // 82% chiều cao màn hình; chỉnh số này nếu cần khớp vị trí thiết kế
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
