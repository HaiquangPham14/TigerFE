import { motion } from "framer-motion";

export function SuccessScreen() {
  const IMG =
    "https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/323%20(1).png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 z-10"
      style={{
        backgroundImage: `url("${IMG}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%", // đúng yêu cầu 100% x 100%
      }}
    />
  );
}
