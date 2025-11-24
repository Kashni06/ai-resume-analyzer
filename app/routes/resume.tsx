import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Summary  from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: "Resumind | Review" },
    { name: "description", content: "Detailed overview of your resume" }
]);

const Resume = () => {
    const { id } = useParams();
    const { auth, isLoading, fs, kv } = usePuterStore();

    const [resumeUrl, setResumeUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [feedback, setFeedback] = useState<any>(null);

    const navigate = useNavigate();

    // 🔐 Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated)
            navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

    // 📥 Load resume + image + feedback
    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;

            const data: any = JSON.parse(resume);

            // PDF
            const resumeBlob = await fs.read(data.resumePath);
            if (resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                setResumeUrl(URL.createObjectURL(pdfBlob));
            }

            // Image
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) {
                setImageUrl(URL.createObjectURL(imageBlob));
            }

            // Feedback JSON
            setFeedback(data.feedback);

            console.log("Loaded Resume Data:", {
                resumeUrl,
                imageUrl,
                feedback: data.feedback
            });
        };

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-3 h-3" />
                    <span className="text-gray-800 text-sm font-semibold">
                        Back to Homepage
                    </span>
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">

                {/* LEFT - Resume Image */}
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    alt="resume"
                                />
                            </a>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 mt-10">Loading resume preview...</p>
                    )}
                </section>

                {/* RIGHT - Feedback */}
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>

                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">

                            {/* Summary → uses NEW JSON fields */}
                            <Summary
                                feedback={feedback.overallScore || 0}
                                suggestions={feedback.action_items || []}
                            />

                            {/* ATS Compatibility */}
                            <ATS score={feedback.ats_compatibility || 0} />

                            {/* Detailed Sections */}
                            <Details feedback={feedback.detailed_feedback || {}} />

                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;
