import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AgeScreen } from "./AgeScreen";
import { RegisterScreen } from "./RegisterScreen";
import { SuccessScreen } from "./SuccessScreen";

type Step = "age" | "register" | "success" | "error";

export default function App() {
  const [step, setStep] = useState<Step>("age");
  const [error, setError] = useState("");

  // ⬇️ Redirect nếu reload tại /app hoặc chưa qua Confirm
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    // Nếu reload thì quay về trang chính
    if (nav?.type === "reload") {
      window.location.replace("https://www.tigerstreetfootball2025.vn/");
      return;
    }

    // Nếu chưa đi qua Confirm thì quay về trang chính
    const ok = localStorage.getItem("passed_confirm") === "1";
    if (!ok) {
      window.location.replace("https://www.tigerstreetfootball2025.vn/");
    }
  }, []);

  return (
    <div
      className="relative w-full bg-hero"
      style={{ minWidth: "320px", minHeight: "100vh" }}
    >
      <div className="absolute inset-0 bg-black/30 sm:bg-black/25 md:bg-black/20 lg:bg-black/15" />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
        <AnimatePresence mode="wait">
          {step === "age" && <AgeScreen onOk={() => setStep("register")} />}

          {step === "register" && (
            <RegisterScreen
              onSuccess={() => setStep("success")}
              onError={(msg) => {
                setError(msg);
                // hiển thị alert đơn giản
                alert(msg);
              }}
            />
          )}

          {step === "success" && <SuccessScreen />}
        </AnimatePresence>
      </div>
    </div>
  );
}
