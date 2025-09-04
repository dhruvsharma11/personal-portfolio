import { Suspense, lazy, useMemo } from 'react';
import Sidebar from '@/components/common/Sidebar';
import ProjectCard from '@/components/projects/ProjectCard';

// Lazy load the background animation
const ProjectsBackground = lazy(() => import('@/components/projects/ProjectsBackground'));

// GitHub icon component
const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function Projects() {
  // Memoize projects array to prevent recreation
  const projects = useMemo(() => [
    {
      title: "PDF-Parser",
      description: "AI-powered tool using YOLOv8 and OpenAI to extract product information from catalogs, streamlining inventory management with computer vision.",
      image: "/Projects/pdf-parser.png",
      githubLink: "https://github.com/dhruvsharma11/PDF-Parser",
      technologies: ["Python", "Lancgchain", "OpenCV", "YOLOv8", "OpenAI"]
    },
    {
      title: "Statify",
      description: "Data-driven music analytics app integrating with Spotify API to provide insights on listening habits and preferences.",
      image: "/Projects/statify.png",
      githubLink: "https://github.com/dhruvsharma11/statify",
      technologies: ["Next.js", "REST API", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "M3DI-AI",
      description: "Audio transcription tool using PyTorch and Whisper to transcribe and summarize medical conversations for better documentation.",
      image: "/Projects/mediai.png",
      githubLink: "https://github.com/dhruvsharma11/M3DI_AI",
      technologies: ["PyTorch", "Whisper", "Hugging Face", "Machine Learning"]
    },
    {
      title: "CritiCinema",
      description: "Movie review platform with IMDB integration for film discovery, reviews, and trailer viewing.",
      image: "/Projects/criticinema.png",
      githubLink: "https://github.com/dhruvsharma11/CritiCinema",
      technologies: ["React", "Node.js", "MySQL", "Express", "Material UI"]
    },
    {
      title: "Breast Cancer Benchmarking",
      description: "ML algorithm comparison for cancer classification using various models including neural networks and traditional ML approaches.",
      image: "/Projects/benchmarking.png",
      githubLink: "https://github.com/dhruvsharma11/Breast-Cancer-Classification",
      technologies: ["Machine Learning", "Scikit-learn", "Neural Networks", "Data Science"]
    },
    {
      title: "Profected",
      description: "AI-powered mentorship platform using KNN algorithm to match students with industry professionals.",
      image: "/Projects/profected.png",
      githubLink: "https://github.com/dhruvsharma11/Profected",
      technologies: ["AI", "KNN Algorithm", "Python", "Flask", "React", "Docker"]
    }
  ], []);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Background Animation - Lazy loaded */}
      <Suspense fallback={null}>
        <ProjectsBackground />
      </Suspense>
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              My Recent <span className="text-blue-600">Works</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here are some of my projects I&apos;ve worked on, showcasing my skills in AI, machine learning, full-stack development, and data science.
            </p>
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="transform transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  githubLink={project.githubLink}
                  technologies={project.technologies}
                />
              </div>
            ))}
          </div>
          
          {/* Footer Section */}
          <div className="text-center mt-16 mb-16">
            <p className="text-gray-600 mb-4">
              Want to see more of my work?
            </p>
            <a
              href="https://github.com/dhruvsharma11"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <GithubIcon />
              View All Projects on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
