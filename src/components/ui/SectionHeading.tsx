import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark"; // light = white text on dark bg, dark = dark text on light bg
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  heading,
  subtext,
  align = "left",
  theme = "dark",
  className = "",
}: SectionHeadingProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  const eyebrowColor = theme === "dark" ? "text-[#7b1d2a]" : "text-[#c9962c]";
  const headingColor = theme === "dark" ? "text-[#1a1a1a]" : "text-white";
  const subtextColor = theme === "dark" ? "text-gray-600" : "text-white/75";

  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <p
          className={`${eyebrowColor} font-sans font-semibold text-xs tracking-widest uppercase mb-3`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif ${headingColor} text-3xl md:text-4xl leading-tight font-bold`}
        dangerouslySetInnerHTML={{ __html: heading }}
      />
      {subtext && (
        <p className={`${subtextColor} font-sans mt-4 text-base leading-relaxed`}>
          {subtext}
        </p>
      )}
    </div>
  );
}
