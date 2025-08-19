"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface Project {
  project_name: string;
  github_repo_url: string;
  category: string;
  primary_language: string;
  stars: number;
  last_updated: string;
  license: string;
  brief_description: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) console.error(error);
      else {
        const sorted = data.sort((a, b) => b.stars - a.stars);
        setProjects(sorted);
        setFilteredProjects(sorted);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const toggleExpanded = (repoUrl: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(repoUrl)) {
      newExpanded.delete(repoUrl);
    } else {
      newExpanded.add(repoUrl);
    }
    setExpandedRows(newExpanded);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 shadow-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <span className="ml-4 text-lg font-medium">
          Loading amazing projects...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Solana Open-Source Hub
            </h1>
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover top Solana projects, sorted by GitHub stars. Search and
              explore the ecosystem.
            </p>
          </header>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by project name or category..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                Found {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-200">
                <thead className="text-xs uppercase bg-gray-900/80 backdrop-blur-sm text-gray-300 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-12">
                      #
                    </th>
                    <th scope="col" className="px-6 py-4 min-w-[200px]">
                      Project Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                      GitHub
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Stars ↓
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-4 min-w-[300px]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <tr
                      key={project.github_repo_url}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4 font-medium text-center text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-300">
                        {project.project_name}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={project.github_repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:scale-105 transform"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          View
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-200 border border-purple-500/30">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center font-medium">
                          <svg
                            className="w-4 h-4 mr-1 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {project.stars.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {project.last_updated}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-sm">
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {project.brief_description}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile and Tablet View */}
        <div className="lg:hidden space-y-4">
          {filteredProjects.map((project, index) => (
            <div
              key={project.github_repo_url}
              className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 sm:p-6 hover:bg-gray-800/60 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600/20 text-blue-400 text-sm font-bold rounded-full">
                      {index + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-blue-300">
                      {project.project_name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-200 border border-purple-500/30">
                      {project.category}
                    </span>
                  </div>
                </div>
                <a
                  href={project.github_repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium rounded-xl border border-blue-500/30 transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">
                    {project.stars.toLocaleString()} stars
                  </span>
                </div>
                <div className="text-gray-400">
                  Updated: {project.last_updated}
                </div>
              </div>

              <div className="relative">
                <p
                  className={`text-gray-300 leading-relaxed text-sm ${
                    expandedRows.has(project.github_repo_url)
                      ? ""
                      : "line-clamp-2"
                  }`}
                >
                  {project.brief_description}
                </p>
                {project.brief_description.length > 100 && (
                  <button
                    onClick={() => toggleExpanded(project.github_repo_url)}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {expandedRows.has(project.github_repo_url)
                      ? "Show less"
                      : "Show more"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.44-.937-5.981-2.456l-.014-.013L8 10.5V8.5L6 10l2 2.5v-2zm1 5.291A7.962 7.962 0 0112 19c2.34 0 4.44-.937 5.981-2.456l.014-.013L16 14.5v2L18 14l-2-2.5v2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 1023px) {
          .scrollbar-thin {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scrollbar-thin::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
