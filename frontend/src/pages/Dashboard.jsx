import axios from "axios";
import { useEffect, useState } from "react";

const RecruitmentDashboard = () => {
  const [activeRound, setActiveRound] = useState("aptitude");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [aptitudePassesCandidates, setAptitudePassesCandidates] = useState([]);
  const AllCandidates = JSON.parse(localStorage.getItem("candidateData")) || [];
  const [aptitudeFailedCandidates, setAptitudeFailedCandidates] = useState([]);
  const [name, setName] = useState("");
  const [companyName, setComapnyName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(
          `${BACKEND_URL}/getUserInfo/${userId}`
        );
        setAptitudeFailedCandidates(response.data.aptitudeFailedCandidates || []);
        setAptitudePassesCandidates(
          response.data.aptitudePassesCandidates || []
        );
        setName(response.data.name);
        setComapnyName(response.data.companyName);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const filteredCandidates = (() => {
    let candidates = AllCandidates;

    if (filterStatus === "selected") {
      candidates = candidates.filter(candidate =>
        aptitudePassesCandidates.includes(candidate.email)
      );
    } else if (filterStatus === "not-selected") {
      candidates = candidates.filter(candidate =>
        aptitudeFailedCandidates.includes(candidate.email)
      );
    }

    // Apply search filter
    candidates = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return candidates;
  })();

  const roundProgressMap = {
    aptitude: { color: "bg-blue-500", text: "Aptitude Round" },
    technical: { color: "bg-green-500", text: "Technical Round" },
    hr: { color: "bg-purple-500", text: "HR Round" },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div
        className="w-72 bg-white shadow-xl p-6 flex flex-col fixed top-0 left-0 h-full"
        style={{ zIndex: 1000 }}
      >
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 w-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            RC
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
        </div>

        <div className="mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(roundProgressMap).map(([round, config]) => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
                ${
                  activeRound === round
                    ? `${config.color} scale-105`
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
            >
              {config.text}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div
        className="flex-1 ml-72 p-8 overflow-y-auto"
        style={{ height: "100vh" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {roundProgressMap[activeRound].text} Candidates
          </h1>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2 px-3 py-2 border rounded-md"
            />
            <div className="flex items-center space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="cursor-pointer bg-white shadow-md rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <option value="all">🔍 All Candidates</option>
                <option value="selected">✅ Selected</option>
                <option value="not-selected">❌ Not Selected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {candidate.name.charAt(0)}
                </div>
                {filterStatus === "selected" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Selected
                  </span>
                )}
                {filterStatus === "not-selected" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    Not Selected
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
              <p className="text-gray-600 mb-2">{candidate.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
