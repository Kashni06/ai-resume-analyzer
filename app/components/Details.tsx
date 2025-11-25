import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "~/components/Accordion";
import ScoreBadge from "~/components/ScoreBadge";

interface DetailsProps {
  feedback: {
    ats_optimization_tips?: string[];
    skill_suggestions?: string[];
    content_improvements?: string[];
  };
}

const ImprovementRow = ({
                          type,
                          text,
                        }: {
  type: "good" | "warning" | "improve";
  text: string;
}) => {
  const icon =
    type === "good"
      ? "/icons/check-green.svg"
      : type === "warning"
        ? "/icons/warning-yellow.svg"
        : "/icons/warning-red.svg";

  const bg =
    type === "good"
      ? "bg-green-50"
      : type === "warning"
        ? "bg-yellow-50"
        : "bg-red-50";

  return (
    <div className={`flex flex-row gap-3 p-3 rounded-lg ${bg}`}>
      <img src={icon} className="w-5 h-5 mt-1" />
      <p className="text-gray-700">{text}</p>
    </div>
  );
};

const Details: React.FC<DetailsProps> = ({ feedback }) => {
  if (!feedback) return null;

  const { ats_optimization_tips = [], skill_suggestions = [], content_improvements = [] } =
    feedback;

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Details</h2>

      <Accordion allowMultiple className="mt-4">
        {/* --------------------------- TONE & STYLE --------------------------- */}
        <AccordionItem id="tone">
          <AccordionHeader itemId="tone">
            <div className="flex justify-between w-full items-center">
              <p className="text-xl font-semibold">Tone & Style</p>
              <ScoreBadge score={70} />
            </div>
          </AccordionHeader>

          <AccordionContent itemId="tone">
            {content_improvements.map((tip, idx) => (
              <ImprovementRow key={idx} type="warning" text={tip} />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* --------------------------- CONTENT --------------------------- */}
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <div className="flex justify-between w-full items-center">
              <p className="text-xl font-semibold">Content</p>
              <ScoreBadge score={65} />
            </div>
          </AccordionHeader>

          <AccordionContent itemId="content">
            {content_improvements.map((tip, idx) => (
              <ImprovementRow key={idx} type="improve" text={tip} />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* --------------------------- STRUCTURE --------------------------- */}
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <div className="flex justify-between w-full items-center">
              <p className="text-xl font-semibold">Structure</p>
              <ScoreBadge score={80} />
            </div>
          </AccordionHeader>

          <AccordionContent itemId="structure">
            {ats_optimization_tips.map((tip, idx) => (
              <ImprovementRow key={idx} type="good" text={tip} />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* --------------------------- SKILLS --------------------------- */}
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <div className="flex justify-between w-full items-center">
              <p className="text-xl font-semibold">Skills</p>
              <ScoreBadge score={70} />
            </div>
          </AccordionHeader>

          <AccordionContent itemId="skills">
            {skill_suggestions.map((tip, idx) => (
              <ImprovementRow key={idx} type="warning" text={tip} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
