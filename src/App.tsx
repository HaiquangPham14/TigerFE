import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AgeScreen } from "./AgeScreen";
import { RegisterScreen } from "./RegisterScreen";
import { SuccessScreen } from "./SuccessScreen";

type Step = "age" | "register" | "success" | "error";

export default function App() {
  const [step, setStep] = useState<Step>("age");
  const [error, setError] = useState("");

  return (
    <div className="relative w-full bg-hero" style={{ minWidth: "320px", minHeight: "100vh" }}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/25 md:bg-black/20 lg:bg-black/15" />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
        <AnimatePresence mode="wait">
          {step === "age" && <AgeScreen onOk={() => setStep("register")} />}

          {step === "register" && (
            <RegisterScreen
              onSuccess={() => setStep("success")}
              onError={(msg) => {
                setError(msg);
                // hiển thị toast tuỳ ý; ở đây để đơn giản alert
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
