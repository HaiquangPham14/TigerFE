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
    <div className="bg-hero app-fixed min-w-[320px] w-full">
      <div className="relative min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
        <AnimatePresence mode="wait" initial={false}>
          {step === "age" && <AgeScreen onOk={() => setStep("register")} />}

          {step === "register" && (
            <RegisterScreen
              onSuccess={() => setStep("success")}
              onError={(msg) => {
                setError(msg);
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
