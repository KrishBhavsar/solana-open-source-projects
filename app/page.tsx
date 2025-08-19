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
  maintainer: string;
  active: string;
  brief_description: string;
  notes: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) console.error(error);
      else {
        const sorted = data.sort((a, b) => b.stars - a.stars);
        setProjects(sorted);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm">
            Loading
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Solana Open-Source Hub
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Discover top Solana projects, sorted by GitHub stars. Scroll
            horizontally to explore more details.
          </p>
        </header>
        <div className="relative bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Scroll Indicator */}
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-800 to-transparent pointer-events-none flex items-center justify-end">
            <span className="text-gray-400 text-sm rotate-90 transform origin-right">
              Scroll →
            </span>
          </div>
          <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-800 to-transparent pointer-events-none flex items-center justify-start">
            <span className="text-gray-400 text-sm -rotate-90 transform origin-left">
              Scroll ←
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs uppercase bg-gray-900 text-gray-300 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th scope="col" className="px-6 py-4 w-12">
                    #
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Project Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    GitHub
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Language
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Stars ↓
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-4">
                    License
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Maintainer
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Active
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.github_repo_url}
                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 font-medium text-center">
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
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
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
                        Link
                      </a>
                    </td>
                    <td className="px-6 py-4">{project.category}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-950 text-blue-200 hover:bg-blue-900 transition-colors duration-200">
                        {project.primary_language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {project.stars}
                      </span>
                    </td>
                    <td className="px-6 py-4">{project.last_updated}</td>
                    <td className="px-6 py-4">{project.license}</td>
                    <td className="px-6 py-4">{project.maintainer}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          project.active === "Yes"
                            ? "bg-green-950 text-green-300"
                            : "bg-red-950 text-red-300"
                        } hover:${
                          project.active === "Yes"
                            ? "bg-green-900"
                            : "bg-red-900"
                        } transition-colors duration-200`}
                      >
                        {project.active}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="group relative">
                        <span className="truncate">
                          {project.brief_description}
                        </span>
                        <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg p-2 w-64 z-10 -mt-1">
                          {project.brief_description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="group relative">
                        <span className="truncate">{project.notes}</span>
                        <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg p-2 w-64 z-10 -mt-1">
                          {project.notes}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
