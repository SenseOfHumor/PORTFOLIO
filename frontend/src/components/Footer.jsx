// Footer.jsx
import React from "react";

/**
 * Brand-new footer
 * - Socials (GitHub / LinkedIn / Email)
 * - Built with (vertical): Reactbits, React, GitHub Pages
 * - Music embed: Apple Music (default) or Spotify
 *
 * TailwindCSS expected in the app.
 */
export default function Footer({
  name = "Swapnil Deb",
  githubUrl = "https://github.com/SenseOfHumor",
  linkedinUrl = "https://linkedin.com/in/swapnil-deb",
  email = "sd2269@njit.edu",

  // Music
  musicProvider = "apple", // "apple" | "spotify"
  musicUrl = "https://music.apple.com/in/playlist/blume/pl.u-e98lGdEuadG46JX", // Apple Music URL or Spotify URL/ID
  musicHeight = 175,
}) {
  const social = [
    { href: githubUrl, label: "GitHub", icon: <GitHubIcon className="size-6 sm:size-7" /> },
    { href: linkedinUrl, label: "LinkedIn", icon: <LinkedInIcon className="size-6 sm:size-7" /> },
    { href: `mailto:${email}`, label: "Email", icon: <EmailIcon className="size-6 sm:size-7" /> },
  ];

  const builtWith = [
    { name: "Reactbits", icon: <ReactbitsIcon className="size-5" />, href: "https://reactbits.dev" },
    { name: "React", icon: <ReactIcon className="size-5" />, href: "https://react.dev" },
    { name: "GitHub Pages", icon: <PagesIcon className="size-5" />, href: "https://pages.github.com/" },
  ];

  return (
    <footer className="w-full border-t border-zinc-200/20 dark:border-zinc-800/60 bg-transparent">
      {/* top divider flair */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-300/40 dark:via-zinc-700/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Column 1 — Brand + Social */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://github.com/SenseOfHumor.png"
                alt={name}
                className="h-10 w-10 rounded-full ring-1 ring-zinc-200 dark:ring-zinc-800"
                loading="lazy"
              />
              <div className="text-center lg:text-left">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">crafted by</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{name}</p>
              </div>
            </div>

            <div className="flex items-center gap-5 pt-1">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Built With (vertical stack) */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Built with</h3>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {builtWith.map((t) => (
                <a
                  key={t.name}
                  href={t.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center justify-start gap-2 rounded-md border border-zinc-200/60 dark:border-zinc-800/70 px-3 py-1.5
                             text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"
                  aria-label={`Learn more about ${t.name}`}
                >
                  <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                    {t.icon}
                  </span>
                  <span>{t.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 — Music */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">On repeat</h3>
            <div className="w-full max-w-sm">
              <MusicEmbed provider={musicProvider} url={musicUrl} height={musicHeight} />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-zinc-200/20 dark:border-zinc-800/60">
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()}{" "}
            <a className="hover:underline" href={githubUrl}>
              {name}
            </a>
            . Deployed on GitHub Pages.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------- Music Embed ----------------------------- */

function MusicEmbed({ provider = "apple", url, height = 175 }) {
  if (!url) return null;

  if (provider === "apple") {
    // Convert music.apple.com -> embed.music.apple.com if needed
    let src = url.trim();
    if (src.includes("music.apple.com") && !src.includes("embed.music.apple.com")) {
      src = src.replace("https://music.apple.com", "https://embed.music.apple.com");
    }
    return (
      <iframe
        title="Apple Music playlist"
        allow="autoplay *; encrypted-media *;"
        frameBorder="0"
        height={height}
        style={{ width: "100%", overflow: "hidden", borderRadius: 12, border: 0 }}
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        src={src}
        loading="lazy"
      />
    );
  }

  // Spotify fallback (accepts full URL or playlist ID)
  const src = url.startsWith("http")
    ? url
    : `https://open.spotify.com/embed/playlist/${url}?utm_source=generator&theme=0&locale=en_US`;

  return (
    <iframe
      title="Spotify playlist"
      style={{ borderRadius: 12, border: 0, width: "100%" }}
      src={src}
      height={height}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    />
  );
}

/* -------------------------------- Icons -------------------------------- */

function GitHubIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.001 2C6.476 2 2 6.475 2 12c0 4.425 2.863 8.162 6.838 9.487.5.087.688-.213.688-.476 0-.237-.013-1.025-.013-1.862-2.513.462-3.163-.613-3.363-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.012-.662.787-.013 1.35.725 1.537 1.025.9 1.512 2.338 1.087 2.913.825.087-.65.35-1.088.637-1.338-2.225-.25-4.55-1.112-4.55-4.937 0-1.088.387-1.988 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .838-.262 2.75 1.025.8-.225 1.65-.337 2.5-.337.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.025 2.75-1.025.55 1.375.2 2.4.1 2.65.637.7 1.025 1.612 1.025 2.7 0 3.837-2.337 4.687-4.562 4.937.363.313.675.913.675 1.85 0 1.338-.012 2.663-.012 3.002 0 .312.2.65.7.55C19.259 20.113 22 16.296 22 12 22 6.475 17.525 2 12.001 2z" />
    </svg>
  );
}

function LinkedInIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.389-2.278-1.39 0-1.602 1.084-1.602 2.204v4.251H9.014V9.75h2.561v1.171h.034c.358-.675 1.228-1.387 2.528-1.387 2.701 0 3.201 1.777 3.201 4.091v4.714zM7.004 8.575c-.858 0-1.547-.695-1.547-1.549 0-.853.69-1.547 1.547-1.547.855 0 1.548.694 1.548 1.547 0 .854-.693 1.549-1.548 1.549zM8.34 18.339H5.667V9.75H8.34v8.589zM19.67 3H4.329C3.595 3 3 3.581 3 4.297V19.703C3 20.42 3.595 21 4.329 21H19.668c.734 0 1.334-.58 1.334-1.297V4.297C21.002 3.58 20.402 3 19.67 3z" />
    </svg>
  );
}

function EmailIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.73 5.41l-1.28 1L12 10.46 6.55 6.37l-1.28-1A2 2 0 0 0 2 7.05v11.59A1.36 1.36 0 0 0 3.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0 0 22 18.64V7.05a2 2 0 0 0-3.27-1.64" />
    </svg>
  );
}

function ReactIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-60 12 12)" />
    </svg>
  );
}

// Minimal "RB" hex for Reactbits
function ReactbitsIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 3h10l4 4v10l-4 4H7l-4-4V7l4-4z" />
      <path d="M8.5 15V9h3a1.75 1.75 0 1 1 0 3.5H8.5m3 0L15.5 15M12 9h3.5" />
    </svg>
  );
}

// Simple page/document icon (for GitHub Pages)
function PagesIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v6h6" />
      <path d="M8 12h8M8 16h8M8 20h8" />
    </svg>
  );
}
