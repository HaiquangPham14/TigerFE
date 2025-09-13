import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AgeScreen } from "./AgeScreen";
import { RegisterScreen } from "./RegisterScreen";
import { SuccessScreen } from "./SuccessScreen";

type Step = "age" | "register" | "success" | "error";

export default function App() {
  // ⚠️ Bắt đầu từ màn confirm
  const [step, setStep] = useState<Step>("age");
  const [error, setError] = useState("");

  return (
    <div className="bg-hero app-fixed min-w-[320px]">
      {/* tránh chắn click: */}
      <div className="absolute inset-0 bg-black/30 sm:bg-black/25 md:bg-black/20 lg:bg-black/15 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
        <AnimatePresence mode="wait" initial={false}>
          {step === "age" && (
            <AgeScreen key="age" onOk={() => setStep("register")} />
          )}

          {step === "register" && (
            <RegisterScreen
              key="register"
              onSuccess={() => setStep("success")}
              onError={(msg) => {
                setError(msg);
                alert(msg);
              }}
            />
          )}

          {step === "success" && <SuccessScreen key="success" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
