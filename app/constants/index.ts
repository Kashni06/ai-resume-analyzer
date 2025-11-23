export const AIResponseFormat = `
{
  "overallScore": number,
  "ats_compatibility": number,
  "content_quality": number,

  "action_items": string[], 

  "detailed_feedback": {
    "ats_optimization_tips": string[],
    "skill_suggestions": string[],
    "content_improvements": string[]
  }
}
`;

export const prepareInstructions = ({
                                      jobTitle,
                                      jobDescription
                                    }: {
  jobTitle: string;
  jobDescription: string;
}) => `
You are an expert in ATS (Applicant Tracking System) and professional resume evaluation.

Analyze the resume thoroughly.

Use the user's job title and job description to tailor the evaluation:
- Job Title: ${jobTitle}
- Job Description: ${jobDescription}

You MUST return ONLY a valid JSON object.
No markdown, no backticks, no commentary.

Use this exact JSON structure:

${AIResponseFormat}

Rules:
- "overallScore" must be from 0 to 100
- Give **real** ATS feedback, not generic response
- Provide at least 5 actionable, clear "action_items"
- Keep all text short, crisp and highly useful
- STRICT JSON only — no extra text
`;
