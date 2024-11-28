import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";

const TechnicalInfo = () => {
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [preGeneratedQuizzes, setPreGeneratedQuizzes] = useState([]);
  const [loader, setLoader] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [newQuiz, setNewQuiz] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    ans: "",
  });

  const generateQuiz = () => {
    setLoader(true);
    axios
      .get(`${BACKEND_URL}/generateQuiz`)
      .then((response) => {
        console.log(response.data);
        setPreGeneratedQuizzes(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
      });
  };

  const getAlreadyGeneratedQuiz = () => {
    setLoader(true);
    axios
      .get(`${BACKEND_URL}/getQuiz`)
      .then((response) => {
        console.log(response.data);
        setPreGeneratedQuizzes(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
      });
  };

  const handlePreGeneratedSelect = (quiz) => {
    setSelectedQuizzes((prevSelectedQuizzes) =>
      prevSelectedQuizzes.find((q) => q.id === quiz.id)
        ? prevSelectedQuizzes.filter((q) => q.id !== quiz.id)
        : [...prevSelectedQuizzes, quiz]
    );
  };

  const handleManualProblemSubmit = (e) => {
    e.preventDefault();
    const newQuizWithId = {
      ...newQuiz,
      id: Date.now(),
    };
    setSelectedQuizzes([...selectedQuizzes, newQuizWithId]);
    setNewQuiz({
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      ans: "",
    });
  };

  const handleClickNextRound = () => {
    const isHr = localStorage.getItem("hrRound");
    if (isHr === "true") {
      navigate("/hrInfo");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Technical Round Manager
        </h1>

        {/* Initial Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowPreGenerated(!showPreGenerated);
              setShowManualForm(false);
              if (!showPreGenerated) generateQuiz();
            }}
            className={`py-4 px-8 rounded-lg transition-all text-lg font-semibold ${
              showPreGenerated
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Generate New Questions
          </button>
          <button
            onClick={() => {
              setShowPreGenerated(!showPreGenerated);
              setShowManualForm(false);
              if (!showPreGenerated) getAlreadyGeneratedQuiz();
            }}
            className={`py-4 px-8 rounded-lg transition-all text-lg font-semibold ${
              showPreGenerated
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            View Pre-generated Questions
          </button>
          <button
            onClick={() => {
              setShowManualForm(!showManualForm);
              setShowPreGenerated(false);
            }}
            className={`py-4 px-8 rounded-lg transition-all text-lg font-semibold ${
              showManualForm
                ? "bg-green-600 text-white"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Create Questions Manually
          </button>
        </div>

        {/* Pre-generated Questions */}
        {showPreGenerated && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Pre-generated Questions
            </h2>
            <div className="h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {loader && <div className="loader">Loading...</div>}
                {preGeneratedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedQuizzes.find((q) => q.id === quiz.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handlePreGeneratedSelect(quiz)}
                  >
                    <p className="font-medium text-gray-800">{quiz.que}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="text-gray-600">A: {quiz.a}</div>
                      <div className="text-gray-600">B: {quiz.b}</div>
                      <div className="text-gray-600">C: {quiz.c}</div>
                      <div className="text-gray-600">D: {quiz.d}</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Answer: Option {quiz.ans.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manual Creation Form */}
        {showManualForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Create a New Problem
            </h2>
            <form onSubmit={handleManualProblemSubmit} className="space-y-4">
              {/* Problem Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  value={newQuiz.title || ""}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newQuiz.description || ""}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  required
                />
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Add Problem
              </button>
            </form>
          </div>
        )}
      </div>
      <button
        onClick={handleClickNextRound}
        className={`  py-3  px-8 mt-6 w-full rounded-lg transition-all text-lg font-semibold ${
          showPreGenerated
            ? "bg-blue-600 text-white"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Next Round Info addon
      </button>
    </div>
  );
};

export default TechnicalInfo;
