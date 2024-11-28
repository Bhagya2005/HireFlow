import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HRRoundInfo() {
  const [isInstructionsRead, setIsInstructionsRead] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (isInstructionsRead) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);

        navigate("/dashboard");
      }, 1700);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          HR Round Instructions
        </h1>
        <div className="space-y-6 text-gray-700">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Instructions:
            </h2>
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">→</span>
                Both you and the candidate will receive an{" "}
                interview key and a link via
                email at the scheduled time.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">→</span>
                Open the provided link and enter the interview key.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">→</span>
                Once both parties have joined, the interview will begin.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">→</span>
                After the interview is completed, the recruiter will decide
                whether the candidate is selectedor{" "}
                not selected for the company.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">→</span>
                Based on the recruiters decision, a response will be sent to the
                candidate via email.
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="instructions-read"
              checked={isInstructionsRead}
              onChange={() => setIsInstructionsRead(!isInstructionsRead)}
              className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="instructions-read"
              className="text-gray-700 font-medium"
            >
              I have read and understood the HR Round Instructions
            </label>
          </div>
          <button
            onClick={handleProceed}
            disabled={!isInstructionsRead}
            className={`w-full py-3 px-8 rounded-lg transition-all text-lg font-semibold ${
              isInstructionsRead
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Proceed to Next Round
          </button>

          {showToast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
              HR Round Information
              <p className="text-sm mt-1">
                You have successfully proceeded to the next round.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
