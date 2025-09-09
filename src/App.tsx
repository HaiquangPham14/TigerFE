import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Shield,
  User,
  Phone,
  KeyRound,
} from "lucide-react";

const API_BASE = "https://tigerbeer2025.azurewebsites.net/api";
const BG_URL =
  "https://cdn.jsdelivr.net/gh/HaiquangPham14/DemoDeloyGame@main/hinh-3-min-1-1720779128049789085270.webp";

function getOrCreateDeviceId() {
  const KEY = "tiger_device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

async function postJson(path: string, data: unknown) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
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
  return { data: payload, status: res.status };
}

export default function App() {
  const [step, setStep] = useState<"age" | "email" | "verify" | "success" | "error">("age");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const deviceId = useMemo(() => getOrCreateDeviceId(), []);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const container = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  } as const;

  function resetAll() {
    setEmail("");
    setFullName("");
    setPhone("");
    setOtp("");
    setCooldown(0);
    setOtpError("");
  }

  function bounce(msg: string, target: "age" | "email" | "verify" = "age") {
    setError(msg);
    setStep("error");
    setTimeout(() => {
      if (target === "age") {
        resetAll();
      } else if (target === "verify") {
        setOtp(""); // reset OTP thôi, giữ email + form
      }
      setStep(target);
    }, 5000);
  }

  async function handleAgeConfirm() {
    setStep("email");
  }

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return bounce("Vui lòng nhập email.", "age");
    setLoading(true);
    try {
      await postJson("/TigerCustomers/request-email-otp", { email });
      setCooldown(30);
      setOtpError("");
      setStep("verify");
    } catch (err: any) {
      bounce(err.message || "Không gửi được OTP.", "age");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !phone || !email || !otp)
      return bounce("Vui lòng nhập đủ thông tin.", "verify");

    setLoading(true);
    setOtpError("");

    try {
      const { status } = await postJson("/TigerCustomers/verify-and-register", {
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        deviceId,
      });

      if (status === 200 || status === 201) {
        setStep("success");
      } else {
        bounce("Không rõ trạng thái tạo tài khoản.", "age");
      }
    } catch (err: any) {
      const msg = (err?.message || "").toString();

      if (err.status === 400) {
        if (
          msg.includes("OTP không đúng") ||
          msg.includes("OTP đã hết hạn") ||
          msg.includes("Nhập sai quá số lần") ||
          msg.includes("Thiếu thông tin") ||
          msg.includes("Số điện thoại đã tồn tại")
        ) {
          bounce(msg, "verify");
          return;
        }
        if (msg.includes("Email đã tồn tại")) {
          bounce(msg, "age");
          return;
        }
        bounce(msg || "Yêu cầu không hợp lệ.", "verify");
        return;
      }

      if (err.status === 409) {
        bounce(msg || "Thiết bị này đã được dùng để đăng ký tài khoản khác.", "age");
        return;
      }

      bounce(msg || "Xác thực thất bại.", "age");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${BG_URL})` }}
    >
      <div className="min-h-screen w-full bg-white/5">
        <div className="min-h-screen flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {step === "age" && (
              <motion.div key="age" variants={container} initial="hidden" animate="show" exit="exit" className="w-full max-w-lg">
                <div className="shadow-xl border rounded-2xl bg-white/95">
                  <div className="p-6 space-y-2 border-b">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <Shield className="w-6 h-6" /> Xác nhận độ tuổi
                    </h2>
                    <p className="text-sm text-slate-500">
                      Bạn cần xác nhận đủ 18 tuổi để tiếp tục tham gia chương trình.
                    </p>
                  </div>
                  <div className="p-6 flex gap-3">
                    <button
                      className="w-full py-3 rounded-xl bg-black text-white hover:opacity-90"
                      onClick={handleAgeConfirm}
                    >
                      Tôi đã đủ 18 tuổi
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "email" && (
              <motion.div key="email" variants={container} initial="hidden" animate="show" exit="exit" className="w-full max-w-lg">
                <div className="shadow-xl border rounded-2xl bg-white/95">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <Mail className="w-6 h-6" /> Đăng ký tham gia
                    </h2>
                    <p className="text-sm text-slate-500">
                      Nhập địa chỉ email để nhận mã OTP xác thực.
                    </p>
                  </div>
                  <form onSubmit={handleRequestOtp} className="p-6 space-y-4">
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="h-11 rounded-xl border px-3"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-black text-white hover:opacity-90"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang gửi...
                        </span>
                      ) : (
                        "Gửi mã OTP"
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {step === "verify" && (
              <motion.div key="verify" variants={container} initial="hidden" animate="show" exit="exit" className="w-full max-w-xl">
                <div className="shadow-xl border rounded-2xl bg-white/95">
                  <div className="p-6 border-b">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <KeyRound className="w-6 h-6" /> Xác thực & tạo tài khoản
                    </h2>
                    <p className="text-sm text-slate-500">
                      Mã OTP đã gửi tới <b>{email}</b>. Vui lòng kiểm tra hộp thư (cả spam).
                    </p>
                  </div>
                  <form onSubmit={handleVerify} className="p-6 grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="fullName" className="text-sm">
                          Họ và tên
                        </label>
                        <div className="flex items-center gap-2 h-11 rounded-xl border px-3">
                          <User className="w-4 h-4 text-slate-400" />
                          <input
                            id="fullName"
                            className="flex-1 outline-none"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm">
                          Số điện thoại
                        </label>
                        <div className="flex items-center gap-2 h-11 rounded-xl border px-3">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <input
                            id="phone"
                            className="flex-1 outline-none"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0901234567"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm">Email</label>
                      <input
                        value={email}
                        readOnly
                        className="h-11 rounded-xl border px-3 bg-slate-50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="otp" className="text-sm">
                        Mã OTP
                      </label>
                      <input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="Nhập 6 số"
                        required
                        inputMode="numeric"
                        type="text"
                        autoComplete="one-time-code"
                        className="h-11 rounded-xl border px-3"
                      />
                      {otpError && <div className="text-sm text-red-600">{otpError}</div>}
                      <div className="text-xs text-slate-500">
                        Thiết bị: <code className="font-mono">{deviceId}</code>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="grow py-3 rounded-xl bg-black text-white hover:opacity-90"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xác thực...
                          </span>
                        ) : (
                          "Xác nhận & tham gia"
                        )}
                      </button>
                      <button
                        type="button"
                        className="py-3 px-4 rounded-xl border hover:bg-slate-50"
                        disabled={cooldown > 0 || loading}
                        onClick={handleRequestOtp}
                      >
                        {cooldown > 0 ? `Gửi lại OTP (${cooldown}s)` : "Gửi lại OTP"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" variants={container} initial="hidden" animate="show" exit="exit" className="w-full max-w-lg">
                <div className="shadow-xl border rounded-2xl bg-white/95 p-8 text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-1">Tham gia thành công!</h2>
                  <p className="text-slate-600">
                    Cảm ơn bạn đã đăng ký. Chúc bạn may mắn khi quay thưởng 🎉
                  </p>
                </div>
              </motion.div>
            )}

            {step === "error" && (
              <motion.div key="error" variants={container} initial="hidden" animate="show" exit="exit" className="w-full max-w-lg">
                <div className="shadow-xl border rounded-2xl bg-white/95 p-8 text-center">
                  <div className="flex justify-center mb-2">
                    <AlertTriangle className="w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-1">Có lỗi xảy ra</h2>
                  <p className="text-slate-600 mb-2">{error || "Xin thử lại."}</p>
                  <p className="text-slate-400 text-sm">Tự động quay lại sau 5 giây…</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
