// ------------------------------
// STATIC DEMO RESUMES
// ------------------------------
export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume_01.pdf",
    feedback: {
      overallScore: 85,
      ats_compatibility: 90,
      content_quality: 88,
      action_items: ["Strong layout", "Good tech stack", "Use more metrics"],
      detailed_feedback: {
        ats_optimization_tips: ["Use consistent job titles"],
        skill_suggestions: ["Add React optimization skills"],
        content_improvements: ["Expand project results with numbers"]
      }
    }
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume_02.pdf",
    feedback: {
      overallScore: 55,
      ats_compatibility: 60,
      content_quality: 58,
      action_items: ["Missing cloud metrics", "Improve summary"],
      detailed_feedback: {
        ats_optimization_tips: ["Add role-specific keywords"],
        skill_suggestions: ["Azure security skills"],
        content_improvements: ["Use bullet points"]
      }
    }
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume_03.pdf",
    feedback: {
      overallScore: 75,
      ats_compatibility: 80,
      content_quality: 78,
      action_items: [],
      detailed_feedback: {
        ats_optimization_tips: [],
        skill_suggestions: [],
        content_improvements: []
      }
    }
  }
];

// ------------------------------
// AI RESPONSE FORMAT
// ------------------------------
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

// ------------------------------
// INSTRUCTIONS SENT TO AI
// ------------------------------
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
- Give real ATS feedback, not generic
- Provide at least 5 clear, actionable "action_items"
- Keep all text short, crisp and highly useful
- STRICT JSON only — no extra words
`;
