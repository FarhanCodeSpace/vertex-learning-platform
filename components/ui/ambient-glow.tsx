import React from "react";

export function AmbientGlow() {
  return (
    <>
      {/* Background subtle diagonal texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 24px)`,
        }}
      />

      {/* Ambient warm glow pillars at bottom */}
      <div className="relative w-full overflow-hidden pointer-events-none h-40 sm:h-56 z-0 mt-20">
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-6 w-full max-w-[1440px] mx-auto opacity-70">
          {[
            { height: "45%", opacity: "from-[#F97316]/30" },
            { height: "65%", opacity: "from-[#FB923C]/40" },
            { height: "85%", opacity: "from-[#F97316]/50" },
            { height: "100%", opacity: "from-[#EA580C]/60" },
            { height: "90%", opacity: "from-[#F97316]/50" },
            { height: "70%", opacity: "from-[#FB923C]/45" },
            { height: "55%", opacity: "from-[#FED7AA]/50" },
            { height: "40%", opacity: "from-[#FED7AA]/35" },
            { height: "60%", opacity: "from-[#FB923C]/45" },
            { height: "80%", opacity: "from-[#F97316]/55" },
            { height: "100%", opacity: "from-[#EA580C]/60" },
            { height: "85%", opacity: "from-[#F97316]/50" },
            { height: "70%", opacity: "from-[#FB923C]/40" },
            { height: "50%", opacity: "from-[#FED7AA]/40" },
            { height: "65%", opacity: "from-[#F97316]/45" },
            { height: "85%", opacity: "from-[#FB923C]/50" },
            { height: "100%", opacity: "from-[#EA580C]/60" },
            { height: "90%", opacity: "from-[#F97316]/50" },
            { height: "60%", opacity: "from-[#FB923C]/40" },
            { height: "45%", opacity: "from-[#FED7AA]/35" },
          ].map((bar, index) => (
            <div
              key={index}
              style={{ height: bar.height }}
              className={`flex-1 min-w-[20px] max-w-[70px] bg-gradient-to-t ${bar.opacity} via-[#FED7AA]/25 to-transparent rounded-t-lg backdrop-blur-xs`}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F97316]/25 to-transparent" />
      </div>
    </>
  );
}
