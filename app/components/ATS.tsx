import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions?: Suggestion[]; // <-- made optional
}

const ATS: React.FC<ATSProps> = ({ score, suggestions = [] }) => {
  //             ^^^^^^^^^^^^^  default empty array (prevents .map crash)

  const gradientClass =
    score > 69
      ? "from-green-100"
      : score > 49
        ? "from-yellow-100"
        : "from-red-100";

  const badgeColor =
    score > 69
      ? "bg-green-100 text-green-700"
      : score > 49
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  const badgeText =
    score > 69 ? "Strong" : score > 49 ? "Good Start" : "Needs Work";

  const iconSrc =
    score > 69
      ? "/icons/ats-good.svg"
      : score > 49
        ? "/icons/ats-warning.svg"
        : "/icons/ats-bad.svg";

  return (
    <div
      className={`p-6 rounded-2xl shadow-md w-full bg-gradient-to-b to-white flex flex-col gap-4 ${gradientClass}`}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-3">
          <img src={iconSrc} className="w-10 h-10" alt="ATS" />
          <p className="text-2xl font-semibold">ATS Score - {score}/100</p>
        </div>

        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
          {badgeText}
        </span>
      </div>

      <div className="mt-2">
        <p className="text-lg font-bold text-gray-800">Great Job!</p>
        <p className="text-gray-600 text-base mt-1">
          This score represents how well your resume is likely to perform in
          Applicant Tracking Systems.
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <div key={i} className="flex flex-row gap-2 items-center">
            <img
              src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              className="w-4 h-4"
              alt=""
            />
            <p className="text-gray-700 text-base">{s.tip}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-base mt-2">
        Keep refining your resume to improve your ATS score.
      </p>
    </div>
  );
};

export default ATS;
