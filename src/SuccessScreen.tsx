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

    type P = { x:number; y:number; vx:number; vy:number; life:number; color:string; size:number; g:number; fade:number; };
    const parts: P[] = [];
    const colors = ["#ffdd55","#ff6b6b","#5eead4","#60a5fa","#f472b6","#facc15"];

    function burst(x:number, y:number) {
      const n = 60 + Math.floor(Math.random()*40);
      for (let i=0;i<n;i++){
        const a = (Math.PI*2*i)/n + Math.random()*0.4;
        const s = 2 + Math.random()*3.5;
        parts.push({
          x, y,
          vx: Math.cos(a)*s,
          vy: Math.sin(a)*s,
          life: 60 + Math.random()*40,
          color: colors[(Math.random()*colors.length)|0],
          size: 2 + Math.random()*2.5,
          g: 0.05 + Math.random()*0.06,
          fade: 0.015 + Math.random()*0.015,
        });
      }
    }

    const t0 = performance.now();
    function tick(now:number){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const elapsed = now - t0;

      if (elapsed < durationMs) {
        if (Math.random() < 0.04) {
          const x = 60 + Math.random()*(window.innerWidth - 120);
          const y = 80 + Math.random()*(window.innerHeight*0.5);
          burst(x,y);
        }
      } else if (parts.length === 0) {
        setRunning(false);
      }

      for (let i=parts.length-1;i>=0;i--){
        const p = parts[i];
        p.life -= 1;
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = Math.max(0, p.life/80 - p.fade);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.life <= 0) parts.splice(i,1);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    const stopTimer = setTimeout(()=>setRunning(false), durationMs+4000);
    return () => {
      clearTimeout(stopTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs]);

  if (!running) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    />
  );
}

export function SuccessScreen() {
  const IMG = "https://cdn.jsdelivr.net/gh/HaiquangPham14/FESS@main/323%20(1).png";
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url("${IMG}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%", // đúng yêu cầu 100% x 100%
      }}
    >
      {/* Pháo bông 3 giây */}
      <Fireworks durationMs={5000} />
    </div>
  );
}
