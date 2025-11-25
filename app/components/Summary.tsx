import ScoreGauge from "~/components/ScoreGauge";

const ScoreBadge = ({ score }: { score: number }) => {
  let color = "";
  let label = "";

  if (score > 70) {
    color = "bg-green-100 text-green-600";
    label = "Strong";
  } else if (score > 49) {
    color = "bg-yellow-100 text-yellow-600";
    label = "Good Start";
  } else {
    color = "bg-red-100 text-red-600";
    label = "Needs Work";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {label}
    </span>
  );
};

const Category = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-6 py-4">
      <p className="text-xl">{title}</p>

      <div className="flex items-center gap-4">
        <p className="text-2xl font-semibold">{score}/100</p>
        <ScoreBadge score={score} />
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: any }) => {
  if (!feedback) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6">

      {/* Score Gauge Row */}
      <div className="flex flex-row items-center gap-8 mb-10">
        <ScoreGauge score={feedback.overallScore || 0} />

        <div>
          <h2 className="text-3xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500 mt-1">
            This score is calculated based on the ATS metrics below.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-5">

        <Category title="ATS Compatibility" score={feedback.ats_compatibility ?? 0} />

        <Category title="Content Quality" score={feedback.content_quality ?? 0} />

        <Category
          title="Action Items"
          score={
            Array.isArray(feedback.action_items)
              ? feedback.action_items.length * 10 // convert count to score appearance
              : 0
          }
        />

        <Category
          title="Skill Suggestions"
          score={
            Array.isArray(feedback.detailed_feedback?.skill_suggestions)
              ? feedback.detailed_feedback.skill_suggestions.length * 10
              : 0
          }
        />

      </div>
    </div>
  );
};

export default Summary;
