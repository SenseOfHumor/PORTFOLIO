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
  "AWS",         // Will use SVGL (Amazon Web Services)
  "MySQL",
  "Bash",
];

// Public SVGL index (no auth; cached in-memory here)
const SVGL_API = "https://api.svgl.app";
let __SVGL_CACHE = null;

// Technologies that should use SVGL (only Java, Convex, AWS)
const USE_SVGL_FOR = new Set(["java", "convex", "aws"]);

/**
 * Normalize display names to increase matching tolerance.
 */
function normalize(s) {
  return s.toLowerCase().replace(/\s+|[._\-\/]/g, " ").trim();
}
function titlesMatch(a, b) {
  return normalize(a) === normalize(b);
}

/**
 * Friendly-name -> canonical SVGL title for the three technologies we want to use SVGL for.
 */
const TITLE_OVERRIDES = {
  aws: "Amazon Web Services",
  convex: "Convex",
  java: "Java",
};

/**
 * Extra aliases to try when titles differ or users type variants.
 */
const ALIAS_MAP = {
  aws: ["AWS", "Amazon Web Services"],
  convex: ["Convex", "Convex DB", "ConvexDB"],
  java: ["Java", "OpenJDK"],
};

// Simple Icons fallback for all other technologies
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

function simpleIconUrl(slug) {
  return `${SIMPLE_ICONS_BASE}/${slug}`;
}

/**
 * Fetch & memoize SVGL index once per session.
 */
function useSvglIndex() {
  const [list, setList] = useState(__SVGL_CACHE);
  const [loading, setLoading] = useState(!__SVGL_CACHE);
  const [error, setError] = useState(null);

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
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (!__SVGL_CACHE) load();
    return () => { cancelled = true; };
  }, []);

  return { list: list ?? [], loading, error };
}

/**
 * Resolve a display name to an SVGL route (https://svgl.app/<slug>.svg)
 * Only for Java, Convex, and AWS
 */
function resolveRouteForTech(name, list) {
  const key = name.toLowerCase();

  // Only use SVGL for specific technologies
  if (!USE_SVGL_FOR.has(key)) {
    return null;
  }

  // Debug logging for AWS
  if (key === 'aws') {
    console.log('AWS Debug:', {
      name,
      key,
      listLength: list.length,
      targetTitle: TITLE_OVERRIDES[key],
      aliases: ALIAS_MAP[key],
      sampleTitles: list.slice(0, 10).map(item => item.title)
    });
  }

  // 1) Canonical title if we know it; else use incoming name
  const targetTitle = TITLE_OVERRIDES[key] ?? name;

  // 2) Exact (normalized) title match
  const exact = list.find((it) => titlesMatch(it.title, targetTitle));
  if (exact?.route) {
    if (key === 'aws') console.log('AWS found exact match:', exact);
    // Handle both string routes and theme-based routes
    if (typeof exact.route === 'string') {
      return exact.route;
    } else if (exact.route?.light) {
      // For theme-based routes, prefer light theme
      return exact.route.light;
    }
  }

  // 3) Try aliases
  const aliases = ALIAS_MAP[key] || [];
  for (const a of aliases) {
    const hit = list.find((it) => titlesMatch(it.title, a));
    if (hit?.route) {
      if (key === 'aws') console.log('AWS found alias match:', hit);
      // Handle both string routes and theme-based routes
      if (typeof hit.route === 'string') {
        return hit.route;
      } else if (hit.route?.light) {
        return hit.route.light;
      }
    }
  }

  // 4) Mild heuristics (strip/join spaces, hyphens, etc.)
  const candidates = [
    targetTitle,
    targetTitle.replace(/\s+/g, ""),
    targetTitle.replace(/\s+/g, "-"),
    targetTitle.replace(/\s+/g, "."),
  ];
  for (const c of candidates) {
    const hit = list.find((it) => titlesMatch(it.title, c));
    if (hit?.route) {
      if (key === 'aws') console.log('AWS found heuristic match:', hit);
      // Handle both string routes and theme-based routes
      if (typeof hit.route === 'string') {
        return hit.route;
      } else if (hit.route?.light) {
        return hit.route.light;
      }
    }
  }

  // // Debug: show what AWS-related items exist
  // if (key === 'aws') {
  //   const awsItems = list.filter(item => 
  //     item.title.toLowerCase().includes('amazon') || 
  //     item.title.toLowerCase().includes('aws')
  //   );
  //   console.log('AWS-related items found:', awsItems);
  // }

  // No icon found → show label only
  return null;
}

/**
 * Get Simple Icons URL for technologies not using SVGL
 */
function getSimpleIconUrl(name) {
  const key = name.toLowerCase();
  const slugs = ICON_CANDIDATES[key] ?? [key];
  return slugs.map(slug => simpleIconUrl(slug));
}

export default function SkillsMarquee({
  technologies = DEFAULT_TECH,
  durationMobile = 60,
  durationDesktop = 50,
  gradientWidth = "8rem",
}) {
  const { list, loading } = useSvglIndex();

  // Render enough items to loop smoothly
  const looped = useMemo(
    () => [...technologies, ...technologies, ...technologies],
    [technologies]
  );

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
          const key = tech.toLowerCase();
          let iconSrc = null;
          let candidates = [];

          // Check if this tech should use SVGL
          if (USE_SVGL_FOR.has(key)) {
            const route = loading ? null : resolveRouteForTech(tech, list);
            if (route) {
              iconSrc = route;
              candidates = [route];
            }
          } else {
            // Use Simple Icons for other technologies
            candidates = getSimpleIconUrl(tech);
            iconSrc = candidates[0] ?? null;
          }

          return (
            <div
              key={`${tech}-${i}`}
              className="flex items-center gap-2 transition-all duration-300 group/item"
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
                      .map(s => s.trim())
                      .filter(Boolean);
                    let idx = parseInt(el.dataset.index || "0", 10);

                    // Try next candidate URL if available
                    if (idx + 1 < list.length) {
                      el.dataset.index = String(idx + 1);
                      el.src = list[idx + 1];
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
