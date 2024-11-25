import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoundSelection = () => {
  const [selectedRounds, setSelectedRounds] = useState({
    aptitude: false,
    technical: false,
    hrRound: false,
  });

  const navigate = useNavigate();

  const handleRoundChange = (round) => {
    setSelectedRounds((prev) => ({
      ...prev,
      [round]: !prev[round],
    }));
  };

  const handleSubmit = () => {
    if (selectedRounds.aptitude === true) {
      localStorage.setItem("aptitude", true);
    }
    if (selectedRounds.technical === true) {
      localStorage.setItem("technical", true);
    }
    if (selectedRounds.hrRound === true) {
      localStorage.setItem("hrRound", true);
    }

    if (selectedRounds.aptitude === true) {
      navigate("/aptitudeInfo");
    } else if (selectedRounds.technical === true) {
      navigate("/technicalInfo");
    } else if (selectedRounds.hrRound === true) {
      navigate("/hrroundInfo");
    } else {
      alert("Please select at least one round.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Rounds Selection
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Choose which interview rounds you'd like to conduct for the
          recruitment process. Select the appropriate rounds to streamline your
          hiring workflow.
        </p>

        <div className="space-y-6 bg-white p-8 rounded-lg border-2 border-gray-200">
          {/* Aptitude Round */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="checkbox"
                id="aptitude"
                checked={selectedRounds.aptitude}
                onChange={() => handleRoundChange("aptitude")}
                className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <label
                htmlFor="aptitude"
                className="text-xl font-medium text-gray-800 cursor-pointer"
              >
                Aptitude/Reasoning Round
              </label>
              <p className="text-gray-500 text-sm mt-1">
                Basic logical, analytical, and problem-solving skills assessment
              </p>
            </div>
          </div>

          {/* Technical Round */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="checkbox"
                id="technical"
                checked={selectedRounds.technical}
                onChange={() => handleRoundChange("technical")}
                className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <label
                htmlFor="technical"
                className="text-xl font-medium text-gray-800 cursor-pointer"
              >
                Technical Round
              </label>
              <p className="text-gray-500 text-sm mt-1">
                In-depth technical knowledge and practical skills evaluation
              </p>
            </div>
          </div>

          {/* HR Round */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="checkbox"
                id="hrRound"
                checked={selectedRounds.hrRound}
                onChange={() => handleRoundChange("hrRound")}
                className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <label
                htmlFor="hrRound"
                className="text-xl font-medium text-gray-800 cursor-pointer"
              >
                HR Round/Final Interview
              </label>
              <p className="text-gray-500 text-sm mt-1">
                Culture fit assessment and final discussion
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-3 px-6 text-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default RoundSelection;
