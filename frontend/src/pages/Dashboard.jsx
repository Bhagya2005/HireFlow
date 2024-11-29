import axios from "axios";
import { useEffect, useState } from "react";

const RecruitmentDashboard = () => {
  const [activeRound, setActiveRound] = useState("aptitude");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [failedCandidates, setfailedCandidates] = useState([])
  const [passesCandidates, setpassedCandidates] = useState([])
  const AllCandidates = JSON.parse(localStorage.getItem("candidateData")) || [];
  const [name, setName] = useState("");
  const [companyName, setComapnyName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {

    const ActiveRound = activeRound

    if(ActiveRound === "aptitude") {
      console.log("Hello from aptitude");
      
      const fetchUserInfo = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
  
        try {
          const response = await axios.get(
            `${BACKEND_URL}/getUserInfo/${userId}`
          );
          setfailedCandidates(
            response.data.aptitudeFailedCandidates || []
          );
          setpassedCandidates(
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
    } if(ActiveRound === "technical") {
      console.log("Hello from technical");
      
      const fetchUserInfo = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
  
        try {
          const response = await axios.get(
            `${BACKEND_URL}/getUserInfo/${userId}`
          );
          setfailedCandidates(
            response.data.techFailedCandidates || []
          );
          setpassedCandidates(
            response.data.techPassesCandidates || []
          );
          setName(response.data.name);
          setComapnyName(response.data.companyName);
          setEmail(response.data.email);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    } 

    if(ActiveRound === "hr") {
      console.log("Hello from hr");
      
      const fetchUserInfo = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
  
        try {
          const response = await axios.get(
            `${BACKEND_URL}/getUserInfo/${userId}`
          );
          setfailedCandidates(
            response.data.aptitudeFailedCandidates || []
          );
          setpassedCandidates(
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
    } 
    

    
  }, [activeRound]);

  const filteredCandidates = (() => {
    let candidates = AllCandidates;

    if (filterStatus === "selected") {
      candidates = candidates.filter((candidate) =>
        passesCandidates.includes(candidate.email)
      );
    } else if (filterStatus === "not-selected") {
      candidates = candidates.filter((candidate) =>
        failedCandidates.includes(candidate.email)
      );
    }

    // Apply search filter
    candidates = candidates.filter((candidate) =>
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
          {/* Aptitude Round Button */}
          <button
            onClick={() => setActiveRound("aptitude")}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
      ${
        activeRound === "aptitude"
          ? "bg-blue-500 scale-105"
          : "bg-gray-300 hover:bg-gray-400"
      }`}
          >
            Aptitude Round
          </button>

          {/* Technical Round Button */}
          <button
            onClick={() => setActiveRound("technical")}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
      ${
        activeRound === "technical"
          ? "bg-green-500 scale-105"
          : "bg-gray-300 hover:bg-gray-400"
      }`}
          >
            Technical Round
          </button>

          {/* HR Round Button */}
          <button
            onClick={() => setActiveRound("hr")}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
      ${
        activeRound === "hr"
          ? "bg-purple-500 scale-105"
          : "bg-gray-300 hover:bg-gray-400"
      }`}
          >
            HR Round
          </button>
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
