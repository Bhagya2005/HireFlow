import React, { useState, useEffect } from "react";
import { Play, AlertCircle, Sun, Moon } from "lucide-react";
import axios from "axios";

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "18.15.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0",
  go: "1.16.2",
  ruby: "3.0.1",
  rust: "1.68.2",
  php: "8.2.3",
};

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [{ content: sourceCode }],
  });
  return response.data;
};

const SAMPLE_PROBLEM = {
  title: "Two Sum",
  description: `Given an array of integers nums and an integer target, return indices of two numbers that add up to target.\n
You may assume each input has exactly one solution.\n
Example 1:\n
Input: nums = [2,7,11,15], target = 9\n
Output: [0,1]\n
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n
\n
Example 2:\n
Input: nums = [3,2,4], target = 6\n
Output: [1,2]\n
\n
Constraints:\n
• 2 <= nums.length <= 104\n
• -109 <= nums[i] <= 109\n
• -109 <= target <= 109\n
• Only one valid answer exists.`,
};

const TechRound = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");

    try {
      const result = await executeCode(selectedLanguage, code);
      setOutput(result.run.output || "No output");
    } catch (err) {
      setError(err.message || "An error occurred while executing the code");
    } finally {
      setIsRunning(false);
    }
  };

  const formatDescription = (desc) => {
    return desc.split("\n").map((line, index) => {
      const isExample = line.trim().toLowerCase().startsWith("example");
      const isConstraint = line.trim().toLowerCase().startsWith("constraints");
      const isInput = line.trim().toLowerCase().startsWith("input:");
      const isOutput = line.trim().toLowerCase().startsWith("output:");
      const isBulletPoint = line.trim().startsWith("•");

      const className = `mb-2 ${
        isDarkMode
          ? isExample
            ? "text-blue-400"
            : isConstraint
            ? "text-purple-400"
            : isInput
            ? "text-emerald-400"
            : isOutput
            ? "text-orange-400"
            : isBulletPoint
            ? "text-gray-300"
            : "text-gray-200"
          : isExample
          ? "text-blue-600"
          : isConstraint
          ? "text-purple-600"
          : isInput
          ? "text-emerald-600"
          : isOutput
          ? "text-orange-600"
          : isBulletPoint
          ? "text-gray-600"
          : "text-gray-800"
      } ${
        isExample || isConstraint
          ? "font-semibold text-lg mt-4"
          : isInput || isOutput
          ? "font-medium ml-4"
          : isBulletPoint
          ? "ml-6"
          : ""
      }`;

      return (
        <p key={index} className={className}>
          {line.trim()}
        </p>
      );
    });
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
      }`}
    >
      <div className="grid grid-cols-2 gap-6 h-full">
        {/* Left Panel */}
        <div
          className={`relative rounded-xl shadow-lg p-6 flex-1 ${
            isDarkMode
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          }`}
        >
          {/* Theme Toggle Button - Moved inside left panel */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <h1
            className={`text-3xl font-bold mb-6 ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            {SAMPLE_PROBLEM.title}
          </h1>
          <div className="prose max-w-none">
            {formatDescription(SAMPLE_PROBLEM.description)}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          {/* Code Editor */}
          <div
            className={`rounded-xl shadow-lg p-6 ${
              isDarkMode
                ? "bg-gray-800/80 border border-gray-700"
                : "bg-white/90 border border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`w-48 p-2 rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-gray-100 border-gray-300 text-gray-800"
                }`}
              >
                {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isDarkMode
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                }`}
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>

            <div
              className={`rounded-lg overflow-hidden ${
                isDarkMode
                  ? "border border-gray-700 bg-gray-900/50"
                  : "border border-gray-300 bg-gray-50"
              }`}
            >
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full h-[50vh] p-4 font-mono text-sm resize-none focus:outline-none bg-transparent ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
                spellCheck="false"
                placeholder="Write your code here..."
              />
            </div>
          </div>

          {/* Output Panel */}
          <div
            className={`rounded-xl shadow-lg p-6 ${
              isDarkMode
                ? "bg-gray-800/80 border border-gray-700"
                : "bg-white/90 border border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"
              }`}
            >
              Output
            </h2>

            {error && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-red-900/50 border-red-700"
                    : "bg-red-100 border-red-200"
                }`}
              >
                <div className="flex items-center">
                  <AlertCircle
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-red-400" : "text-red-600"
                    }`}
                  />
                  <div
                    className={`ml-2 font-semibold ${
                      isDarkMode ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    Error
                  </div>
                </div>
                <div
                  className={`mt-2 ${
                    isDarkMode ? "text-red-200" : "text-red-700"
                  }`}
                >
                  {error}
                </div>
              </div>
            )}

            <pre
              className={`p-4 rounded-lg h-32 overflow-auto font-mono text-sm ${
                isDarkMode
                  ? "bg-gray-900/50 border border-gray-700 text-gray-200"
                  : "bg-gray-50 border border-gray-300 text-gray-800"
              }`}
            >
              {output || "Run your code to see the output here..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechRound;
