// src/components/InfiniteSkill.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";

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

  // 1) Canonical title if we know it; else use incoming name
  const targetTitle = TITLE_OVERRIDES[key] ?? name;

  // 2) Exact (normalized) title match
  const exact = list.find((it) => titlesMatch(it.title, targetTitle));
  if (exact?.route) {
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
      // Handle both string routes and theme-based routes
      if (typeof hit.route === 'string') {
        return hit.route;
      } else if (hit.route?.light) {
        return hit.route.light;
      }
    }
  }

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

function TechItem({ tech, loading, list }) {
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
    <div className="flex items-center gap-2 transition-all duration-300 group/item flex-shrink-0 mx-6 md:mx-10">
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
}

export default function InfiniteSkill({
  technologies = DEFAULT_TECH,
  speed = 2,
  gradientWidth = "8rem",
  direction = "left",
  interactive = true,
}) {
  const { list, loading } = useSvglIndex();
  
  const measureRef = useRef(null);
  const containerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [offset, setOffset] = useState(0);
  
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  // Calculate total width needed and create repeated content
  const totalItems = useMemo(() => {
    if (!itemWidth) return technologies;
    // Create many more repeats to ensure infinite scrolling never runs out
    const minRepeats = 10; // Minimum number of repetitions
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const repeatsNeeded = Math.max(minRepeats, Math.ceil((containerWidth * 3) / itemWidth));
    return Array(repeatsNeeded).fill(technologies).flat();
  }, [technologies, itemWidth]);

  const ready = itemWidth > 0;

  // Measure item width
  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.getBoundingClientRect().width;
      setItemWidth(width * technologies.length);
    }
  }, [technologies, list, loading]);

  // Initialize offset
  useEffect(() => {
    if (!itemWidth) return;
    const initial = -itemWidth;
    setOffset(initial);
  }, [itemWidth]);

  // Animation loop
  useEffect(() => {
    if (!itemWidth || !ready) return;
    let frame = 0;
    let currentOffset = -itemWidth; // Use local variable instead of state
    
    const step = () => {
      if (!dragRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        currentOffset += delta;
        
        // Continuous wrapping - reset to start when we've moved one full set
        while (currentOffset <= -itemWidth * 2) {
          currentOffset += itemWidth;
        }
        while (currentOffset > 0) {
          currentOffset -= itemWidth;
        }
        
        // Update the actual DOM element directly to avoid state re-renders
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(${currentOffset}px)`;
        }
      }
      frame = requestAnimationFrame(step);
    };
    
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [itemWidth, ready]); // Removed speed from dependencies to prevent restarts

  // Interactive handlers
  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current || !containerRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    
    // Get current transform value
    const currentTransform = containerRef.current.style.transform;
    const currentOffset = parseFloat(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || 0);
    
    let newOffset = currentOffset + dx;
    
    // Same continuous wrapping logic
    while (newOffset <= -itemWidth * 2) {
      newOffset += itemWidth;
    }
    while (newOffset > 0) {
      newOffset -= itemWidth;
    }
    
    containerRef.current.style.transform = `translateX(${newOffset}px)`;
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = interactive
    ? dragRef.current
      ? "grabbing"
      : "grab"
    : "auto";

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

      {/* Hidden measure element */}
      <div
        ref={measureRef}
        className="flex absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {technologies.map((tech, i) => (
          <TechItem key={`measure-${tech}-${i}`} tech={tech} loading={loading} list={list} />
        ))}
      </div>

      {/* Marquee track */}
      <div
        ref={containerRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{
          visibility: ready ? "visible" : "hidden",
          cursor: cursorStyle,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {totalItems.map((tech, i) => (
          <TechItem key={`${tech}-${i}`} tech={tech} loading={loading} list={list} />
        ))}
      </div>
    </div>
  );
}
