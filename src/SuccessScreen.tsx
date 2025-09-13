import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Fireworks({ durationMs = 3000 }: { durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
      gravity: number; fade: number;
    };

    const particles: Particle[] = [];
    const colors = ["#ffdd55", "#ff6b6b", "#5eead4", "#60a5fa", "#f472b6", "#facc15"];

    function burst(x: number, y: number) {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 2 + Math.random() * 3.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 40,
          color: colors[(Math.random() * colors.length) | 0],
          size: 2 + Math.random() * 2.5,
          gravity: 0.05 + Math.random() * 0.06,
          fade: 0.015 + Math.random() * 0.015,
        });
      }
    }

    // Liên tục tạo pháo ngẫu nhiên trong 3s
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed < durationMs) {
        // tạo 1–2 vụ nổ mỗi ~300ms
        if (Math.random() < 0.04) {
          const x = 60 + Math.random() * (window.innerWidth - 120);
          const y = 80 + Math.random() * (window.innerHeight * 0.5);
          burst(x, y);
        }
      } else if (particles.length === 0) {
        setRunning(false);
      }

      // update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = Math.max(0, p.life / 80 - p.fade);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    const stopTimer = setTimeout(() => setRunning(false), durationMs + 4000);
    return () => {
      stopTimer && clearTimeout(stopTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs]);

  if (!running) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}

export function SuccessScreen() {
  const IMG =
    "https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/323%20(1).png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative min-h-screen w-full overflow-y-auto"
      style={{
        backgroundImage: `url("${IMG}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
      }}
    >
      {/* Canvas pháo bông 3 giây */}
      <Fireworks durationMs={3000} />
      {/* Nếu muốn có vùng đệm để chắc chắn có thể cuộn, thêm 1 spacer nhỏ: */}
      <div className="h-[10vh]" />
    </motion.div>
  );
}
