// src/components/SkillsMarquee.jsx
import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_TECH = [
  "Python",
  "FastAPI",
  "Java",
  "C",
  "React",
  "TailwindCSS",
  "Git",
  "Convex",
  "Clerk",
  "AWS",
  "MySQL",
  "Bash",
];

// --- ICON SOURCES ---
const SVGL_API = "https://api.svgl.app";
let __SVGL_CACHE = null;

const USE_SVGL_FOR = new Set(["java", "convex", "aws"]);
const TITLE_OVERRIDES = { aws: "Amazon Web Services", convex: "Convex", java: "Java" };
const ALIAS_MAP = {
  aws: ["AWS", "Amazon Web Services"],
  convex: ["Convex", "Convex DB", "ConvexDB"],
  java: ["Java", "OpenJDK"],
};

const SIMPLE_ICONS_BASE = "https://cdn.simpleicons.org";
const ICON_CANDIDATES = {
  python: ["python"],
  fastapi: ["fastapi"],
  c: ["c"],
  react: ["react"],
  tailwindcss: ["tailwindcss"],
  git: ["git"],
  clerk: ["clerk"],
  mysql: ["mysql"],
  bash: ["gnubash", "bash"],
};

function simpleIconUrl(slug) { return `${SIMPLE_ICONS_BASE}/${slug}`; }
function normalize(s) { return s.toLowerCase().replace(/\s+|[._\-\/]/g, " ").trim(); }
function titlesMatch(a, b) { return normalize(a) === normalize(b); }

// --- HOOK TO LOAD SVGL INDEX ---
function useSvglIndex() {
  const [list, setList] = useState(__SVGL_CACHE);
  const [loading, setLoading] = useState(!__SVGL_CACHE);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (__SVGL_CACHE) return;
      try {
        setLoading(true);
        const res = await fetch(SVGL_API);
        const data = await res.json();
        __SVGL_CACHE = data;
        if (!cancelled) setList(data);
      } catch (e) {
        console.error("SVGL fetch error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (!__SVGL_CACHE) load();
    return () => { cancelled = true; };
  }, []);
  return { list: list ?? [], loading };
}

function resolveRouteForTech(name, list) {
  const key = name.toLowerCase();
  if (!USE_SVGL_FOR.has(key)) return null;
  const targetTitle = TITLE_OVERRIDES[key] ?? name;
  const exact = list.find((it) => titlesMatch(it.title, targetTitle));
  if (exact?.route) return typeof exact.route === "string" ? exact.route : exact.route.light;
  for (const a of ALIAS_MAP[key] || []) {
    const hit = list.find((it) => titlesMatch(it.title, a));
    if (hit?.route) return typeof hit.route === "string" ? hit.route : hit.route.light;
  }
  return null;
}

function getSimpleIconUrl(name) {
  const key = name.toLowerCase();
  const slugs = ICON_CANDIDATES[key] ?? [key];
  return slugs.map(simpleIconUrl);
}

function SkillsMarquee({
  technologies = DEFAULT_TECH,
  durationMobile = 10,   // smoother default
  durationDesktop = 25,  // smoother default
  gradientWidth = "8rem",
}) {
  const { list, loading } = useSvglIndex();

  // ✅ Two copies only; seamless when animating to -50% of track width
  const looped = useMemo(() => [...technologies, ...technologies], [technologies]);

  return (
    <div className="relative overflow-hidden py-8 group">
      {/* side gradients */}
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

      {/* marquee track */}
      <div className="marquee-track flex gap-12 md:gap-20 whitespace-nowrap will-change-transform w-max">
        {looped.map((tech, i) => {
          const key = tech.toLowerCase();
          let iconSrc = null;
          let candidates = [];

          if (USE_SVGL_FOR.has(key)) {
            const route = loading ? null : resolveRouteForTech(tech, list);
            if (route) { iconSrc = route; candidates = [route]; }
          } else {
            candidates = getSimpleIconUrl(tech);
            iconSrc = candidates[0] ?? null;
          }

          return (
            <div
              key={`${tech}-${i}`}
              className="flex items-center gap-2 transition-all duration-300 group/item whitespace-nowrap"
            >
              {iconSrc && (
                <img
                  src={iconSrc}
                  alt={tech}
                  className="h-7 w-auto object-contain transition-transform opacity-60 group-hover/item:scale-110"
                  width="30"
                  height="30"
                  loading="lazy"
                  decoding="async"
                  data-candidates={candidates.join(",")}
                  data-index="0"
                  onError={(e) => {
                    const el = e.currentTarget;
                    const list = (el.dataset.candidates || "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    let idx = parseInt(el.dataset.index || "0", 10);
                    if (idx + 1 < list.length) {
                      el.dataset.index = String(idx + 1);
                      el.src = list[idx + 1];
                    } else {
                      el.style.display = "none";
                    }
                  }}
                />
              )}
              <span className="text-lg font-medium text-[var(--white-icon,#fff)]">{tech}</span>
            </div>
          );
        })}
      </div>

      {/* animation css */}
      <style>{`
        @keyframes skills-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); } /* move exactly one copy */
        }
        .marquee-track {
          animation: skills-marquee-scroll ${durationMobile}s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
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

export default React.memo(SkillsMarquee);
