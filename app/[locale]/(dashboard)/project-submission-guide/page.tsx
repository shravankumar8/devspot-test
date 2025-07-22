"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "overview", title: "Project Submission" },
  { id: "help", title: "Getting Started" },
  { id: "template", title: "Template Guide" },
  { id: "process", title: "Submission Process" },
  { id: "requirements", title: "Requirements" },
  { id: "tips", title: "FAQ" },
];

const ProjectSubmission = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const jsonTemplate = `{
  "name": "Your Project Name",
  "tagline": "One-liner summary of your project",
  "description": "What it does, how it works, and the tech used.",
  "team": [
    {
      "name": "Your Name",
      "email": "youremail@example.com"
    }
  ],
  "demo_url": "https://example.com/demo",
  "video_url": "https://youtube.com/watch?v=your-demo-video",
  "technologies": ["React", "Ethers.js", "Polygon"]
}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Handle navigation click
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    window.history.pushState(null, "", `#${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.some((item) => item.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
            window.history.replaceState(null, "", `#${id}`);
          }
        });
      },
      { rootMargin: "-90px 0px -80% 0px", threshold: 0 }
    );

    // Observe all section elements
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);


  return (
    <div className="min-h-screen text-white container mx-auto px-4 py-8 flex flex-col md:flex-row">
      {/* Fixed Sidebar */}
      <div className="md:w-1/4 lg:w-1/5 md:pr-8 md:block hidden">
        <nav className="sticky top-20 space-y-1">
          <div className="flex flex-col space-y-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`py-2 px-4 text-sm font-medium transition-colors duration-200 cursor-pointer  border-l-2 text-secondary-text ${
                  activeSection === section.id
                    ? "border-l-main-primary  text-primary text-white"
                    : "border-l-transparent hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(section.id);
                  document.getElementById(section.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content with left margin to account for fixed sidebar */}
      <div className="md:w-3/4 lg:w-4/5 mt-5 md:mt-0">
        <div className="max-w-4xl">
          <div
            id="overview"
            ref={(el) => {
              sectionRefs.current.overview = el;
            }}
          >
            <h1 className="text-[32px] font-semibold mb-3">
              Project Submission Instructions
            </h1>
            <p className="text-base text-secondary-text mb-10 font-roboto">
              Last updated June 18, 2025
            </p>

            <div className="prose prose-invert max-w-none">
              <div className="mb-8">
                <p className="text-lg mb-6">
                  🚨 <strong>Heads up, builders!</strong>
                </p>

                <p className="mb-6 text-secondary-text leading-relaxed text-sm font-roboto">
                  To submit your project, you'll need to add a{" "}
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">
                    project.json
                  </code>{" "}
                  file to the root of your GitHub repo. This is how our Judge
                  Bot pulls your info for scoring 🧠⚖️
                </p>

                <h2 className="text-base font-bold mb-4 text-white font-roboto">
                  Here's the template you should use:
                </h2>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 overflow-x-auto relative">
                  <Button
                    onClick={copyToClipboard}
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 bg-gray-700 border-gray-600 hover:bg-gray-600 flex gap-1 items-center"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <pre className="text-sm text-gray-300 pr-20">
                    {jsonTemplate}
                  </pre>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6 text-sm font-roboto">
                  <p className="text-yellow-200">
                    <strong>⚠️ Important:</strong> The email you enter MUST
                    match the one you used to sign up for DevSpot. If it
                    doesn't, we won't be able to auto-add you to the project!
                  </p>
                </div>

                <p className="mb-6 text-secondary-text leading-relaxed text-sm font-roboto">
                  Once it's in your repo, just submit your GitHub URL through
                  the site and you're good to go 🚀
                </p>

                <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6 text-sm">
                  <p className="text-blue-200">
                    📎 <strong>Need a template?</strong>{" "}
                    <a
                      href="#"
                      className="hover:text-main-primary text-blue-400 underline"
                    >
                      Click here to copy the sample project.json
                    </a>
                  </p>
                </div>

                <p className="text-sm mb-8 text-secondary-text font-roboto">
                  You're almost there — let's ship it! 💪
                </p>
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current.help = el;
            }}
            id="help"
            className="mb-8"
          >
            <h2 className="text-lg font-bold mb-4 font-roboto text-white">
              🛠️ Need help?
            </h2>

            <div id="template">
              <h3 className="text-base font-semibold mb-3 text-white font-roboto">
                How to Use This Template
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold mb-2 text-white font-roboto">
                    Create a project.json File
                  </h4>
                  <p className="text-secondary-text font-roboto">
                    Inside your project's GitHub repository, add a file named{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">
                      project.json
                    </code>{" "}
                    in the root folder.
                  </p>
                </div>

                <div
                  ref={(el) => {
                    sectionRefs.current.process = el;
                  }}
                  id="process"
                  className="font-roboto"
                >
                  <h4 className="text-lg font-semibold mb-2 text-white">
                    Fill in the Fields
                  </h4>
                  <ul className="space-y-2 text-secondary-text text-sm">
                    <li>
                      <strong>name:</strong> Your full project name.
                    </li>
                    <li>
                      <strong>tagline:</strong> A short, catchy one-liner that
                      sums up your project.
                    </li>
                    <li>
                      <strong>description:</strong> A few paragraphs describing
                      what your project does, how it works, and the tech stack
                      you used.
                    </li>
                    <li>
                      <strong>team:</strong> List the names and emails of all
                      your team members.
                    </li>
                  </ul>

                  <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-4 my-4 font-roboto text-sm">
                    <p className="text-orange-200">
                      <strong>👉 Important:</strong> Each team member must use
                      the same email they used to sign up for DevSpot —
                      otherwise, they won't be automatically added to the
                      project.
                    </p>
                  </div>

                  <ul className="space-y-2 text-secondary-text font-roboto text-sm">
                    <li>
                      <strong>demo_url:</strong> A live demo link of your
                      working project (if available).
                    </li>
                    <li>
                      <strong>video_url:</strong> A 2–3 minute video walkthrough
                      (YouTube or Loom links work great).
                    </li>
                    <li>
                      <strong>technologies:</strong> A list of major
                      technologies, frameworks, or protocols used.
                    </li>
                  </ul>
                </div>

                <div
                  ref={(el) => {
                    sectionRefs.current.requirements = el;
                  }}
                  id="requirements"
                >
                  <h4 className="text-lg font-semibold mb-2 text-white font-roboto">
                    Submit Your Repo
                  </h4>
                  <p className="text-secondary-text font-roboto text-sm">
                    When you submit your project on DevSpot, include the GitHub
                    repo link that contains this{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">
                      project.json
                    </code>{" "}
                    file. Our Judge Bot will automatically read it to streamline
                    scoring and feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current.tips = el;
            }}
            id="tips"
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-3 text-white font-roboto">
              🧠 Tips
            </h3>
            <ul className="space-y-2 text-secondary-text text-sm font-roboto">
              <li>• Double-check your links and make sure they're public.</li>
              <li>
                • Use the same email you used to sign up on DevSpot — that's how
                we assign you to your project!
              </li>
              <li>
                • Keep your{" "}
                <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">
                  project.json
                </code>{" "}
                clean and descriptive — judges use this to evaluate your work.
              </li>
            </ul>

            <p className="mt-6 font-roboto text-base">
              DM us if you have questions. Let's get it 💥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
