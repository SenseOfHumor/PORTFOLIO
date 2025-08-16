import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A luxe contact section with:
 * - Animated gradient halo + glass card
 * - Floating labels
 * - Progress / success states
 * - Honeypot anti-spam field
 * - Formspree integration
 */
export default function ContactShowcase({
  formAction = "https://formspree.io/f/xyzpvqjl",
  location = "New Jersey, USA",
  nameLabel = "Name",
  emailLabel = "Email",
  messageLabel = "Message",
  ctaLabel = "Send message",
  headingEyebrow = "👋 Let’s talk  ",
  headingTitle = "Tell me about your idea",
  headingCopy = "Two lines is enough. I’ll reply quickly, promise.",
}) {
  const [status, setStatus] = useState(/** 'idle' | 'loading' | 'success' | 'error' */ "idle");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(formAction, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative isolate py-20 sm:py-28">
      {/* ambient gradient halo */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div 
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-[100%] blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            background:
              "radial-gradient(60% 40% at 50% 10%, hsl(262 83% 66% / .4), transparent 60%), radial-gradient(40% 60% at 70% 50%, hsl(198 93% 60% / .3), transparent 60%), radial-gradient(40% 50% at 30% 60%, hsl(158 70% 50% / .25), transparent 60%)",
          }}
        />
        <motion.div 
          className="absolute left-1/3 top-1/4 h-[400px] w-[600px] rounded-[100%] blur-2xl"
          animate={{ 
            rotate: -360,
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, hsl(280 100% 70% / .2), transparent 70%)",
          }}
        />
        <motion.div 
          className="absolute right-1/4 bottom-1/3 h-[350px] w-[500px] rounded-[100%] blur-2xl"
          animate={{ 
            rotate: 360,
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 22, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, hsl(200 100% 70% / .25), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[1.1fr_.9fr]">
        {/* Left: copy + meta */}
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--white-icon-tr)]/60 bg-white/5 px-4 py-2 text-sm text-[var(--sec)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--sec)]" />
            <span>{headingEyebrow}</span>
          </div>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--white)] md:text-5xl">
            {headingTitle}
          </h2>

          <p className="mt-4 text-left text-[var(--white-icon)]">
            {headingCopy}
          </p>

          <dl className="mt-8 grid w-full grid-cols-1 gap-3 sm:max-w-sm">
            <div className="flex items-center gap-2">
              <dt className="text-[var(--white-icon)]">Location:</dt>
              <dd className="text-[var(--white)]">{location}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-[var(--white-icon)]">GitHub:</dt>
              <dd>
                <a
                  href="https://github.com/SenseOfHumor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--sec)] underline-offset-4 hover:underline"
                >
                  @SenseOfHumor
                </a>
              </dd>
            </div>
          </dl>
        </motion.div>

        {/* Right: form card */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="relative"
        >
          {/* shimmering border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-[linear-gradient(120deg,hsl(262_83%_66%/.55),transparent_30%,hsl(198_93%_60%/.45),transparent_70%,hsl(158_70%_50%/.45))]" />
          {/* glass card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-7">
            <form onSubmit={onSubmit} action={formAction} method="POST" className="space-y-5">
              {/* honeypot (bots trip here) */}
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
              {/* optional subject to make emails cleaner */}
              <input type="hidden" name="_subject" value="Portfolio contact" />

              <FloatField label={nameLabel}>
                <input
                  required
                  name="from_name"
                  id="from_name"
                  type="text"
                  className="peer w-full rounded-lg border border-[var(--white-icon-tr)] bg-[#141414b3] px-4 py-3 text-[var(--white)] placeholder-transparent outline-none transition focus:border-[var(--sec)]/50 focus:ring-2 focus:ring-[var(--sec)]/40"
                />
              </FloatField>

              <FloatField label={emailLabel}>
                <input
                  required
                  name="reply_to"
                  id="reply_to"
                  type="email"
                  className="peer w-full rounded-lg border border-[var(--white-icon-tr)] bg-[#141414b3] px-4 py-3 text-[var(--white)] placeholder-transparent outline-none transition focus:border-[var(--sec)]/50 focus:ring-2 focus:ring-[var(--sec)]/40"
                />
              </FloatField>

              <FloatField label={messageLabel}>
                <textarea
                  required
                  name="message"
                  id="message"
                  rows={6}
                  className="peer w-full resize-none rounded-lg border border-[var(--white-icon-tr)] bg-[#141414b3] px-4 py-3 text-[var(--white)] placeholder-transparent outline-none transition focus:border-[var(--sec)]/50 focus:ring-2 focus:ring-[var(--sec)]/40"
                />
              </FloatField>

              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--white-icon-tr)] bg-[var(--white-icon-tr)]/90 px-5 py-3 text-[var(--white)] transition hover:bg-[var(--white-icon-tr)] focus:outline-none"
                >
                  {/* animated sheen */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)] transition group-hover:translate-x-0" />
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "idle" && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        {ctaLabel}
                      </motion.span>
                    )}
                    {status === "loading" && (
                      <motion.span
                        key="loading"
                        className="inline-flex items-center gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Spinner /> Sending…
                      </motion.span>
                    )}
                    {status === "success" && (
                      <motion.span
                        key="success"
                        className="inline-flex items-center gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Check /> Sent — talk soon!
                      </motion.span>
                    )}
                    {status === "error" && (
                      <motion.span
                        key="error"
                        className="inline-flex items-center gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Cross /> Something went wrong
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- subcomponents ---------- */

function FloatField({ label, children }) {
  return (
    <label className="group relative block">
      {children}
      <span
        className="
          pointer-events-none absolute left-4 top-3.5 
          text-sm text-[var(--white-icon)]
          transition-all duration-200 ease-out
          peer-focus:opacity-0 peer-focus:scale-95
          peer-valid:opacity-0 peer-valid:scale-95
        "
      >
        {label}
      </span>
    </label>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
  );
}
function Check() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M20 7L10 17L4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Cross() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
