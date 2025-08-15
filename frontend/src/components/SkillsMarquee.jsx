// src/components/SkillsMarquee.jsx
import React from "react";

const DEFAULT_TECH = [
  "Python",
  "FastAPI",
  "Java",
  "C",
  "React",
  "TailwindCSS",
  "Git",
  "ConvexDb",     // we'll hide the icon for this one
  "Clerk",
  "AWS",
  "MySQL",
  "Bash",
];

// Map each display name → array of candidate Simple Icons slugs (in order)
const ICON_CANDIDATES = {
  python: ["python"],
  fastapi: ["fastapi"],
  java: ["java", "openjdk"],        // try 'java', then 'openjdk'
  c: ["c"],
  react: ["react"],
  tailwindcss: ["tailwindcss"],
  git: ["git"],
  convex: [],                       // empty → hide icon (label still shows)
  clerk: ["clerk"],
  aws: ["amazonaws", "aws"],        // try 'amazonaws', then 'aws'
  mysql: ["mysql"],
  bash: ["gnubash", "bash"],        // try 'gnubash', then 'bash'
};

function getCandidates(name) {
  const key = name.toLowerCase();
  return ICON_CANDIDATES[key] ?? [key];
}

function iconUrlFromSlug(slug) {
  return `https://cdn.simpleicons.org/${slug}`;
}

export default function SkillsMarquee({
  technologies = DEFAULT_TECH,
  durationMobile = 60,
  durationDesktop = 50,
  gradientWidth = "8rem",
}) {
  const looped = [...technologies, ...technologies, ...technologies];

  return (
    <div className="relative overflow-x-hidden py-8 group">
      {/* Side gradients */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20"
        style={{
          width: gradientWidth,
          background:
            "linear-gradient(to right, var(--background, hsl(240 10% 4%)) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20"
        style={{
          width: gradientWidth,
          background:
            "linear-gradient(to left, var(--background, hsl(240 10% 4%)) 0%, transparent 100%)",
        }}
      />

      {/* Marquee track */}
      <div className="flex w-max gap-12 md:gap-20 marquee-track">
        {looped.map((tech, i) => {
          const candidates = getCandidates(tech);

          // If no candidates (e.g., Convex), render no icon—just the label.
          const initialSrc = candidates.length ? iconUrlFromSlug(candidates[0]) : null;

          return (
            <div
              key={`${tech}-${i}`}
              className="flex items-center gap-2 transition-all duration-300 group/item"
            >
              {initialSrc && (
                <img
                  src={initialSrc}
                  alt={tech}
                  className="h-7 w-auto object-contain transition-transform opacity-60 group-hover/item:scale-110"
                  width="30"
                  height="30"
                  loading="lazy"
                  // keep track of candidates in data attrs (no extra state/hooks needed)
                  data-candidates={candidates.join(",")}
                  data-index="0"
                  onError={(e) => {
                    const el = e.currentTarget;
                    const list = (el.dataset.candidates || "").split(",").filter(Boolean);
                    let idx = parseInt(el.dataset.index || "0", 10);

                    // Try next candidate if available
                    if (idx + 1 < list.length) {
                      el.dataset.index = String(idx + 1);
                      el.src = iconUrlFromSlug(list[idx + 1]);
                    } else {
                      // No candidates left → hide icon, keep label
                      el.style.display = "none";
                    }
                  }}
                />
              )}

              <span className="text-lg font-medium text-[var(--white-icon,#fff)]">
                {tech}
              </span>
            </div>
          );
        })}
      </div>

      {/* Local CSS for animation */}
      <style>{`
        @keyframes skills-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: skills-marquee-scroll ${durationMobile}s linear infinite;
        }
        .group:hover .marquee-track { animation-play-state: paused; }
        @media (min-width: 768px) {
          .marquee-track { animation-duration: ${durationDesktop}s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
