import { useState, useEffect } from "react";
import {
  Play,
  AlertCircle,
  Sun,
  Clock,
  Moon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import sendHREmail from "../components/HRemail";
let current = "entrance";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

let currentlyScored = 0;

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

let isPasteAllowed = true;

const UserInfoDialog = ({ onSubmit, isDarkMode }) => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [candidateEmails, setCandidatesEmails] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!userId.trim()) {
        console.error("No userId found.");
        alert("User ID is required.");
        return;
      }

      // Fetch user info from the backend
      const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);

      // Extract emails from the response
      const emails =
        response.data.candidateData?.map((candidate) => candidate.email) || [];
      setCandidatesEmails(emails);

      // Check if the entered email exists
      const emailExists = emails.some(
        (candidateEmail) => candidateEmail === email
      );

      if (!emailExists) {
        alert("Email does not exist. Please enter a valid email.");
        return;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      alert("Failed to fetch user info. Please try again later.");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    // Store user info in localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("technicalUserId", userId);
    localStorage.setItem("technicalUserEmail", email);

    // Disable paste when technical round starts
    isPasteAllowed = false;

    try {
      const userId = localStorage.getItem("technicalUserId");
      if (!userId) {
        console.error("No userId found in localStorage.");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);

      const techTime = response.data.techTime || 0;
      localStorage.setItem("techTime", techTime);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }

    onSubmit();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
          isDarkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        >
          Technical Round
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className={`block mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={`w-full p-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="userId"
              className={`block mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              className={`w-full p-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className={`block mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full p-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            />
          </div>
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                isDarkMode
                  ? "bg-red-900/50 text-red-300"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {error}
            </div>
          )}
          <button
            // type="submit"
            // onClick={startTechRound}
            className={`w-full p-3 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            }`}
          >
            Start Technical Round
          </button>
        </form>
      </div>
    </div>
  );
};

const TechRound = () => {
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitRunning, setSubmitIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [techSolvedArr, setTechSolvedArr] = useState([]);
  const [codeStore, setCodeStore] = useState({});
  const [jobRole, setjobRole] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(true);

  const [techTiming, setTechTiming] = useState(
    localStorage.getItem("techTime") || 0
  );
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [allowPaste, setAllowPaste] = useState(true);
  const [currentPage, setCurrentPage] = useState("entrance");
  const [passingMarks, setpassingMarks] = useState("");

  const [testCaseResults, setTestCaseResults] = useState([]);

  const [showCheatingModal, setShowCheatingModal] = useState(false);

  // useEffect(() => {
  //   const handlePaste = (e) => {
  //     if (!isPasteAllowed) {
  //       e.preventDefault();
  //       alert("Pasting is disabled during the technical round.");
  //     }
  //   };

  //   // Add paste event listener to the document
  //   document.addEventListener("paste", handlePaste);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     document.removeEventListener("paste", handlePaste);
  //   };
  // }, []);
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden && !isPasteAllowed) {
  //       console.log(
  //         "User has switched to another tab or minimized the browser."
  //       );
  //       setShowCheatingModal(true);
  //     }
  //   };

  //   // Add the event listener
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  const handleEndSession = async () => {
    alert(
      "Do you really want to end this session, all your problems will be sent for checking?"
    );
    console.log("starthere");
    console.log(
      "Passing for tech : ",
      passingMarks,
      "CandidateSolved are : ",
      currentlyScored
    );

    try {
      // Make the API call and wait for the response
      const response = await axios.post(`${BACKEND_URL}/updateUser`, {
        userId: localStorage.getItem("technicalUserId"),
        userEmail: localStorage.getItem("technicalUserEmail"),
        technicalScore: currentlyScored,
      });
      console.log(
        "Round times updated successfully in backend...:",
        response.data
      );

      if (response.data.message === "true") {
        console.log("Send email to hr round");
        const templateParams = {
          jobRole: jobRole,
          linkForNextRound: ` ${BACKEND_URL}/hrRoundEntrance`,
          companyName: companyName,
          to_email: localStorage.getItem("technicalUserEmail"),
        };

        try {
          await sendHREmail(templateParams);
          console.log("Email sent successfully!");
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      }
      // window.location.reload(true);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  // Fetch user info and set technical timing
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("technicalUserId");
        if (!userId) {
          console.error("No userId found in localStorage.");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/getUserInfo/${userId}`
        );

        console.log("All backend data : ", response.data);

        const techTime = response.data.techTime || 0;
        setTechTiming(techTime);
        setRemainingTime(techTime * 60); // Convert minutes to seconds
        setIsTimerRunning(true);
        setjobRole(response.data.jobRole);
        setcompanyName(response.data.companyName);
        setpassingMarks(response.data.technicalPassingMarks);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [techTiming]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            handleTimeExpired();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTime]);

  const handleTestCases = (currentProblem, output) => {
    if (!currentProblem.testCases || currentProblem.testCases.length === 0) {
      return [];
    }

    return currentProblem.testCases.map((testCase) => {
      const isCorrect = compareTestCaseOutputs(
        testCase.expectedOutput.toString(),
        output.toString()
      );

      return {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: output,
        isCorrect,
      };
    });
  };

  const handleTimeExpired = async () => {
    // Attempt to submit all solved problems
    try {
      for (let i = 0; i < problems.length; i++) {
        const problemCode = codeStore[i] || code;

        if (problemCode) {
          await axios.post(`${BACKEND_URL}/checkTechSolution`, {
            title: problems[i].title,
            desc: problems[i].desc,
            code: problemCode,
          });
        }
      }

      // Update user after submitting all problems
      handleEndSession();
    } catch (error) {
      console.error("Error submitting problems on time expiration:", error);
    }

    // You might want to add a modal or redirect logic here
    alert("Technical round time has expired!");
    handleEndSession();
  };

  // Real-time code syncing using SSE
  useEffect(() => {
    const eventSource = new EventSource(`${BACKEND_URL}/api/events`);
    eventSource.onmessage = (event) => {
      const { text: newCode } = JSON.parse(event.data);
      setCode(newCode);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const updateUser = async () => {
    let userEmail = localStorage.getItem("technicalUserEmail");

    const templateParams = {
      jobRole: jobRole,
      linkForNextRound: `${BACKEND_URL}/hrRoundEntrance`,
      companyName: companyName,
      to_email: userEmail,
    };

    try {
      await sendHREmail(templateParams);
      console.log("Email sent successfully!");
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/updateUser`,
        {
          userEmail: userEmail,
          userId: localStorage.getItem("technicalUserId"),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response);
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while scheduling the interview");
    }
  };

  // Update code in backend on change
  const handleCodeChange = async (newCode) => {
    setCode(newCode);
    await axios.post(`${BACKEND_URL}/api/update`, { text: newCode });
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getTech`, {
          params: { userId: localStorage.getItem("technicalUserId") },
          headers: { "Content-Type": "application/json" },
        });

        // Filter out empty problems and ensure we have valid problem objects
        const validProblems = response.data.techEntries.filter(
          (problem) => problem && typeof problem === "object" && problem.title
        );

        setProblems(validProblems);
        console.log("Tech data: ", validProblems);

        // Initialize code store for all problems
        const initialCodeStore = {};
        validProblems.forEach((_, index) => {
          initialCodeStore[index] = "";
        });
        setCodeStore(initialCodeStore);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tech:", error);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    setTestCaseResults([]);

    try {
      const result = await executeCode(selectedLanguage, code);
      const output = result.run.output || "No output";
      setOutput(output);

      // Use the new test case handling logic
      const results = handleTestCases(currentProblem, output);
      setTestCaseResults(results);

      // Check if all test cases pass
      const allTestCasesPassed = results.every((result) => result.isCorrect);

      // Optionally, you can add additional logic here for handling all test cases passing
    } catch (err) {
      setError(err.message || "An error occurred while executing the code");
    } finally {
      setIsRunning(false);
    }
  };

  const compareTestCaseOutputs = (expectedOutput, actualOutput) => {
    // Trim both outputs
    const trimmedExpected = expectedOutput.trim();
    const trimmedActual = actualOutput.trim();

    // Check if the outputs are equal after trimming
    if (trimmedExpected === trimmedActual) {
      return true;
    }

    // Try parsing as numbers
    const numExpected = Number(trimmedExpected);
    const numActual = Number(trimmedActual);
    if (!isNaN(numExpected) && !isNaN(numActual) && numExpected === numActual) {
      return true;
    }

    // Try parsing as floats with precision check
    const floatExpected = parseFloat(trimmedExpected);
    const floatActual = parseFloat(trimmedActual);
    if (!isNaN(floatExpected) && !isNaN(floatActual)) {
      // Check if the difference is very small (accounting for floating-point precision)
      return Math.abs(floatExpected - floatActual) < 1e-9;
    }

    // Optional: Handle array-like outputs
    const normalizeArrayOutput = (output) => {
      return output
        .replace(/[\[\]]/g, "") // Remove square brackets
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
        .split(" ")
        .map((item) => item.trim())
        .filter((item) => item !== "")
        .join(" ");
    };

    const normalizedExpected = normalizeArrayOutput(trimmedExpected);
    const normalizedActual = normalizeArrayOutput(trimmedActual);

    return normalizedExpected === normalizedActual;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatDescription = (desc) => {
    if (!desc) return null;

    return desc.split("\n").map((line, index) => {
      const trimmedLine = line.trim();
      const isExample = trimmedLine.toLowerCase().startsWith("example");
      const isConstraint = trimmedLine.toLowerCase().startsWith("constraints");
      const isInput = trimmedLine.toLowerCase().startsWith("input:");
      const isOutput = trimmedLine.toLowerCase().startsWith("output:");
      const isBulletPoint = trimmedLine.startsWith("•");

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
          {trimmedLine}
        </p>
      );
    });
  };

  const handleProblemChange = (newIndex) => {
    // Ensure newIndex is within valid range
    if (newIndex < 0 || newIndex >= problems.length) return;

    // Save current code to store
    setCodeStore((prev) => ({
      ...prev,
      [currentProblemIndex]: code,
    }));

    // Set new problem index
    setCurrentProblemIndex(newIndex);

    // Load code for new problem, defaulting to empty string if undefined
    setCode(codeStore[newIndex] || "");

    // Reset output and error
    setOutput("");
    setError(null);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  if (showUserInfoDialog) {
    return (
      <UserInfoDialog
        onSubmit={() => setShowUserInfoDialog(false)}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        Loading problems...
      </div>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        No problems found. Please contact support.
      </div>
    );
  }

  if (!problems.length) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        No problems found.
      </div>
    );
  }

  const currentProblem = problems[currentProblemIndex];

  const handleSubmit = async () => {
    setSubmitIsRunning(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/checkTechSolution`, {
        title: currentProblem.title,
        desc: currentProblem.desc,
        code: code,
      });

      console.log(response);

      if (response.data.cleanedResponse.success) {
        currentlyScored += 1;
      }

      if (response.data) {
        setOutput(
          response.data.cleanedResponse.summary || "Evaluation successful"
        );
        setError(null);
      } else {
        setError(response.data.error);
        setOutput("");
      }

      console.log(`Solved problems count: ${currentlyScored}`);
    } catch (error) {
      console.error(error);
      setError("An error occurred while executing the code");
      setOutput("");
    } finally {
      setSubmitIsRunning(false);
    }
  };

  return (
    <div
      className={`min-h-screen min-w-full p-4 flex ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
      }`}
    >
      <div className="grid grid-cols-2 gap-4 w-full h-[calc(100vh-2rem)]">
        {/* Left Panel */}
        <div
          className={`relative rounded-xl shadow-lg p-4 flex flex-col overflow-hidden ${
            isDarkMode
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          }`}
        >
          {/* Problem Navigation and Theme Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Existing navigation buttons */}
              <button
                onClick={handleEndSession}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isDarkMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-700 hover:bg-red-800 text-white"
                }`}
              >
                End Session
              </button>
              {/* Timer Display */}
              <div
                className={`flex items-center px-4 py-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-200 text-gray-800"
                } ${remainingTime <= 60 ? "animate-pulse text-red-500" : ""}`}
              >
                <Clock className="mr-2 h-5 w-5" />
                <span className="font-mono text-sm">
                  {formatTime(remainingTime)}
                </span>
              </div>
              <button
                onClick={() => handleProblemChange(currentProblemIndex - 1)}
                disabled={currentProblemIndex === 0}
                className={`p-2 rounded-full ${
                  currentProblemIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-200"
                }`}
              >
                <ChevronLeft
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              </button>

              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Problem {currentProblemIndex + 1} of {problems.length}
              </span>

              <button
                onClick={() => handleProblemChange(currentProblemIndex + 1)}
                disabled={currentProblemIndex === problems.length - 1}
                className={`p-2 rounded-full ${
                  currentProblemIndex === problems.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-200"
                }`}
              >
                <ChevronRight
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              </button>
            </div>

            {/* Timer and Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
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
            </div>
          </div>

          <h1
            className={`text-3xl font-bold mb-4 ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            {currentProblem.title}
          </h1>
          <div className="prose max-w-none overflow-y-auto pr-2">
            {formatDescription(currentProblem.desc)}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4 h-full">
          {/* Code Editor */}
          <div
            className={`rounded-xl shadow-lg p-4 flex-1 flex flex-col ${
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
                onClick={handleSubmit}
                disabled={isSubmitRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isDarkMode
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                }`}
              >
                <Play className="h-4 w-4" />
                {isSubmitRunning ? "Submitting..." : "Submit"}
              </button>

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
              className={`rounded-lg overflow-hidden flex-1 ${
                isDarkMode
                  ? "border border-gray-700 bg-gray-900/50"
                  : "border border-gray-300 bg-gray-50"
              }`}
            >
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  handleCodeChange(e.target.value);
                }}
                className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-transparent ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
                spellCheck="false"
                placeholder="Write your code here..."
              />
            </div>
          </div>

          {/* Output and Test Cases Panel */}
          <div className="flex gap-4 h-[250px]">
            {/* Output Panel */}
            <div
              className={`w-1/2 rounded-xl shadow-lg p-4 ${
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
                style={{
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                {output || "Run your code to see the output here..."}
              </pre>
            </div>

            {/* Test Cases Panel */}
            <div
              className={`w-1/2 rounded-xl shadow-lg p-4 overflow-auto ${
                isDarkMode
                  ? "bg-gray-800/80 border border-gray-700"
                  : "bg-white/90 border border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  isDarkMode
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                }`}
              >
                Test Cases
              </h2>

              {currentProblem.testCases &&
              currentProblem.testCases.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {currentProblem.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-900/50 border-gray-700"
                          : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`font-semibold ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Test Case {index + 1}
                        </span>
                        {testCaseResults[index] &&
                          (testCaseResults[index].isCorrect ? (
                            <CheckCircle2 className="text-green-500 h-5 w-5" />
                          ) : (
                            <XCircle className="text-red-500 h-5 w-5" />
                          ))}
                      </div>
                      <div
                        className={`mb-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">Input:</span>{" "}
                        {testCase.input}
                      </div>
                      <div
                        className={`mb-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">Expected:</span>{" "}
                        {testCase.expectedOutput}
                      </div>
                      {testCaseResults[index] && (
                        <div
                          className={`${
                            testCaseResults[index].isCorrect
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          <span className="font-medium">Actual:</span>{" "}
                          {testCaseResults[index].actualOutput}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`text-center py-8 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No test cases available for this problem
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCheatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Cheating Detected
            </h2>
            <p className="mb-6">
              You have been detected switching tabs or minimizing the browser
              during the technical round.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  // Redirect to exit page or close the application
                  window.location.reload();
                  window.exit();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Exit, You have been rejected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechRound;
