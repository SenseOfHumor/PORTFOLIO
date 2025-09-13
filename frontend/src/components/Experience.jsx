"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function WorkTimeline() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const update = () => setHeight(ref.current.getBoundingClientRect().height);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const data = [
    {
      title: "2026 — Prudential Financial (Incoming Rotational SDE)",
      content: (
        <div>
          <p className="mb-4 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
            Accepted an offer to join Prudential’s Rotational Software Engineering program starting 2026.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <li>Will rotate across Global Technology teams to find our areas of interest</li>
            <li>Program designed to accelerate leadership and technical depth</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Summer 2025 — Prudential Financial (Global Technology Summer Intern)",
      content: (
        <div>
          <p className="mb-4 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
            Developed high‑visibility DevOps platform features and won multiple hackathon competitions.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <li>Built a scalable FastAPI backend for GitHub’s REST API with optimized queries and modular architecture; integrated into production codebase</li>
            <li>Delivered a consolidated workflow‑run view surfacing critical insights hidden in GitHub’s UI, reducing investigation time by up to 10 minutes</li>
            <li>Implemented filtering, pagination, and drill‑downs for faster discovery of pipeline data across repositories</li>
            <li>Solution gained strong adoption interest, with multiple teams requesting expedited rollout</li>
            <li><strong>Winner</strong> — Prudential Summer 2025 Hackathon & RoboRace Competition</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Fall 2024 — Prudential Financial (Technology & Data Co‑op, Threat Intel)",
      content: (
        <div>
          <p className="mb-4 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
            Engineered integrations and pipelines to accelerate cyber threat investigations.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <li>Engineered data pipelines between Threat Intelligence and SIEM platforms, enhancing data accessibility and efficiency</li>
            <li>Integrated ThreatConnect and AttackIQ, reducing analysis and response times by 14%</li>
            <li>Discovered and documented hidden API endpoints enabling automation and cross‑platform workflows</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Spring 2023 — UPS (Software Developer Intern)",
      content: (
        <div>
          <p className="mb-4 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
            Built a delivery‑prioritization program as part of a PCCC STEM & HISPA sponsored internship.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <li>Developed a lightweight tool for smaller packages reducing delivery time by 20%</li>
            <li>Applied Dijkstra’s and A* algorithms with OpenStreetMap & Google Maps APIs, improving routing efficiency by 5%</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div
      className="w-full font-sans md:px-10 text-left"
      ref={containerRef}
    >
  {/* <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 lg:px-10">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight py-2 mb-4 text-white dark:text-white max-w-4xl">
          My Work Experience
        </h2>
  <p className="text-neutral-400 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          A clean timeline of internships, co‑op, and full‑time roles.
        </p> */}
      {/* </div> */}

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl text-[var(--sec)] mb-20 shiny-sec">My Experience</h2>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-8">
        {data.map((item, index) => (
          <div key={index} className="relative py-6 md:py-10">
            {/* left marker */}
            <div className="absolute left-3 top-6 md:top-8 h-10 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center z-20">
              <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2 z-30" />
            </div>

            {/* title above content for single-column layout */}
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-500 dark:text-neutral-500 mb-3 pl-16 md:pl-20">
              {item.title}
            </h3>

            <div className="pl-16 md:pl-20 pr-4">
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] z-0"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full z-0"
          />
        </div>
      </div>
    </div>
  );
}


export default function Experience() {
  // Render inside the surrounding <section className="section"> in App.jsx
  return (
    <div className="section-content w-full text-left">
      <WorkTimeline />
    </div>
  );
}
