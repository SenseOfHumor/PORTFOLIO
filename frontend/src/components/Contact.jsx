"use client";
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "motion/react";

export default function ContactForm({
  formAction = "https://formspree.io/f/xyzpvqjl",
  location = "New Jersey, USA",
  githubHandle = "@SenseOfHumor",
  nameLabel = "Your name",
  emailLabel = "Email address",
  messageLabel = "Message",
  ctaLabel = "Send message",
}) {
  const rootRef = useRef(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".cf-card", { y: 18, opacity: 0, duration: 0.5 })
        .from(
          ".cf-head, .cf-meta, .cf-field",
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.1"
        )
        .from(".cf-cta", { y: 8, opacity: 0, duration: 0.45 }, "-=0.2");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const form = e.currentTarget;

    // Honeypot
    if (form.elements["website"].value) {
      setStatus({ type: "error", message: "Submission blocked." });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const res = await fetch(formAction, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Thanks! Your message is on its way.",
        });
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({
          type: "error",
          message:
            data?.errors?.[0]?.message ||
            "‼️ Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "‼️ Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={rootRef} className="flex justify-center px-4 sm:px-6 md:px-8">
      <div className="cf-card relative max-w-2xl rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-sm bg-transparent">
        {/* HEADER */}
        <header className="cf-head">
          <h2 className="text-left text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100 whitespace-nowrap flex items-baseline gap-2">
            <span>👋 Tell me about</span>
            <RotatingTextPill
              texts={[
                "your idea",
                "your project",
                "your startup",
                "your challenge",
                "a feature",
                "a bug",
                "a Job opportunity",
              ]}
              interval={3200}
              spring={{ type: "spring", damping: 26, stiffness: 320 }}
            />
          </h2>

          <p className="mt-2 text-left text-sm text-zinc-400">
            Keep it short and sweet. I read every message and will reply soon.. I promise!
          </p>
        </header>

        {/* META */}
        <div className="cf-meta mt-5 flex items-center gap-3 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <MapPinIcon className="size-4" />
            <span className="select-all">{location}</span>
          </span>
          <span className="h-3 w-px bg-zinc-800" />
          <a
            href={`https://github.com/${githubHandle.replace(/^@/, "")}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 hover:underline underline-offset-4"
          >
            <GitHubIcon className="size-4" />
            <span className="truncate max-w-[12ch] sm:max-w-none">
              {githubHandle}
            </span>
          </a>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 gap-5"
          noValidate
        >
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            className="hidden"
            tabIndex={-1}
          />

          <InputBare
            className="cf-field"
            id="name"
            name="name"
            type="text"
            placeholder={nameLabel}
            autoComplete="name"
            required
          />

          <InputBare
            className="cf-field"
            id="email"
            name="email"
            type="email"
            placeholder={emailLabel}
            autoComplete="email"
            required
          />

          <TextareaBare
            className="cf-field"
            id="message"
            name="message"
            placeholder={messageLabel}
            rows={6}
            required
          />

          <div aria-live="polite" className="min-h-6">
            {status.type === "success" && (
              <p className="text-sm text-emerald-400">{status.message}</p>
            )}
            {status.type === "error" && (
              <p className="text-sm text-rose-400">{status.message}</p>
            )}
          </div>

          <div className="cf-cta flex">
            <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium
                        text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700
                        shadow-sm hover:shadow transition-[transform,box-shadow] active:scale-[0.98]
                        disabled:opacity-60 disabled:hover:bg-zinc-900 disabled:text-zinc-400
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
            >
            {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" /> Sending…
                </span>
            ) : (
                ctaLabel
            )}
            </button>

          </div>

          <p className="mt-1 text-[11px] text-zinc-500">
            Powered by Formspree. We never share your information.
          </p>
        </form>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             RotatingTextPill                               */
/* -------------------------------------------------------------------------- */

function RotatingTextPill({
  texts = ["your idea"],
  interval = 2200,
  spring = { type: "spring", damping: 26, stiffness: 320 },
}) {
  const [index, setIndex] = useState(0);
  const widest = useMemo(
    () => texts.reduce((a, b) => (a.length >= b.length ? a : b), texts[0] ?? ""),
    [texts]
  );

  const measurerRef = useRef(null);
  const [minW, setMinW] = useState(0);

  useEffect(() => {
    if (!measurerRef.current) return;
    const node = measurerRef.current;
    const measure = () => setMinW(Math.ceil(node.offsetWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [widest]);

  useEffect(() => {
    if (texts.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, Math.max(600, interval));
    return () => clearInterval(id);
  }, [texts.length, interval]);

  return (
    <span className="relative inline-flex items-center align-baseline">
      {/* Invisible measurer for width */}
      <span className="absolute -z-10 -left-[10000px] top-0">
        <span
          ref={measurerRef}
          className="inline-flex items-center rounded-md px-2.5 py-0.5 text-blue-200 bg-blue-900/30 ring-1 ring-inset ring-blue-600/50 text-xl sm:text-2xl font-semibold"
        >
          {widest}
        </span>
      </span>

      {/* Visible box */}
      <span
        className="relative inline-flex items-center rounded-md px-2.5 py-0.5
                   text-blue-200 bg-blue-900/30 ring-1 ring-inset ring-blue-600/50
                   overflow-hidden"
        style={{ minWidth: minW ? `${minW}px` : undefined }}
      >
        {/* Height stabilizer */}
        <span className="invisible select-none pointer-events-none text-xl sm:text-2xl font-semibold">
          {widest}
        </span>

        {/* Animated current text, clipped inside box */}
        <span className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={index}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={spring}
              className="inline-block text-xl sm:text-2xl font-semibold will-change-transform"
            >
              {texts[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Bare Input/Textarea                            */
/* -------------------------------------------------------------------------- */

function InputBare({ className = "", ...rest }) {
  return (
    <input
      className={
        "block rounded-xl border border-zinc-800 bg-transparent px-4 py-3 " +
        "text-[15px] text-left text-zinc-100 placeholder-zinc-500 " +
        "focus:outline-none focus:ring-4 ring-0 focus:ring-white/10 " +
        "transition-shadow focus:placeholder-transparent [&:not(:placeholder-shown)]:placeholder-transparent " +
        className
      }
      {...rest}
    />
  );
}

function TextareaBare({ className = "", rows = 6, ...rest }) {
  return (
    <textarea
      rows={rows}
      className={
        "block resize-y rounded-xl border border-zinc-800 bg-transparent px-4 py-3 " +
        "text-[15px] text-left leading-relaxed text-zinc-100 placeholder-zinc-500 " +
        "focus:outline-none focus:ring-4 focus:ring-white/10 " +
        "transition-shadow min-h-32 focus:placeholder-transparent [&:not(:placeholder-shown)]:placeholder-transparent " +
        className
      }
      {...rest}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */

function MapPinIcon({ className = "size-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 22s7-5.33 7-12a7 7 0 10-14 0c0 6.67 7 12 7 12z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function GitHubIcon({ className = "size-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 00-3.64 22.42c.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.71-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.26 3.4.96.11-.76.41-1.26.75-1.55-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.2-3.07-.12-.29-.52-1.46.12-3.05 0 0 .98-.31 3.2 1.17a11.14 11.14 0 015.82 0c2.22-1.48 3.2-1.17 3.2-1.17.64 1.59.24 2.76.12 3.05.75.8 1.2 1.82 1.2 3.07 0 4.4-2.69 5.36-5.25 5.64.42.37.8 1.1.8 2.22 0 1.6-.02 2.89-.02 3.28 0 .31.21.68.8.56A11.5 11.5 0 0012 .5z" />
    </svg>
  );
}

function Spinner({ className = "size-4" }) {
  return (
    <svg className={"animate-spin " + className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}
