import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AptitudeInfo() {
  const navigate = useNavigate();
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showExistingQuestions, setShowExistingQuestions] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [preGeneratedQuizzes, setPreGeneratedQuizzes] = useState([]);
  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    que: "",
    a: "",
    b: "",
    c: "",
    d: "",
    ans: "",
  });

  // Replace with your actual backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handlePreGeneratedSelect = (quiz) => {
    setSelectedQuizzes((prevSelectedQuizzes) => {
      const quizIndex = prevSelectedQuizzes.findIndex((q) => q.id === quiz.id);
      return quizIndex > -1
        ? prevSelectedQuizzes.filter((q) => q.id !== quiz.id)
        : [...prevSelectedQuizzes, quiz];
    });
  };

  const handleManualQuizSubmit = (e) => {
    e.preventDefault();
    const newQuizWithId = {
      ...newQuiz,
      id: Date.now(),
    };
    setSelectedQuizzes([...selectedQuizzes, newQuizWithId]);
    setNewQuiz({
      que: "",
      a: "",
      b: "",
      c: "",
      d: "",
      ans: "",
    });
  };

  // const simulateLoading = () => {
  //   setLoader(true);
  //   setTimeout(() => setLoader(false), 1500);
  // };

  const handleExistingQuestionSelect = (quiz) => {
    setSelectedQuizzes((prevSelectedQuizzes) => {
      const quizIndex = prevSelectedQuizzes.findIndex((q) => q.id === quiz.id);
      return quizIndex > -1
        ? prevSelectedQuizzes.filter((q) => q.id !== quiz.id)
        : [...prevSelectedQuizzes, quiz];
    });
  };

  const generateQuiz = () => {
    setLoader(true);
    console.log("Generating....");
    axios
      .get(`${BACKEND_URL}/generateQuiz`)
      .then((response) => {
        console.log("Success");
        console.log(response.data);
        setPreGeneratedQuizzes(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
        console.log("Error in generating");
      });
  };

  const getAlreadyGeneratedQuiz = () => {
    setLoader(true);
    axios
      .get(`${BACKEND_URL}/getQuiz`)
      .then((response) => {
        console.log(response.data);
        setExistingQuizzes(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
      });
  };

  function nextRound() {
    const isTechnical = localStorage.getItem("technical");
    const isHr = localStorage.getItem("hrRound");
    if (isTechnical === "true") {
      navigate("/technicalInfo");
    } else if (isHr === "true") {
      navigate("/hrInfo");
    } else {
      navigate("/dashboard");
    }

    console.log("selectedQuizzes: ", selectedQuizzes);

    try {
      const response = axios.post(`${BACKEND_URL}/addQuiz`, {
        questions: selectedQuizzes,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Aptitude Question Addon
        </h1>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowPreGenerated(true);
              setShowManualForm(false);
              setShowExistingQuestions(false);
              generateQuiz();
              // simulateLoading();
            }}
            className="py-4 px-8 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            Generated New Questions
          </button>
          <button
            onClick={() => {
              setShowManualForm(true);
              setShowPreGenerated(false);
              setShowExistingQuestions(false);
            }}
            className="py-4 px-8 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
          >
            Create Questions Manually
          </button>
          <button
            onClick={() => {
              setShowExistingQuestions(true);
              setShowPreGenerated(false);
              getAlreadyGeneratedQuiz();
              setShowManualForm(false);
              // simulateLoading();
            }}
            className="py-4 px-8 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            View Existing Questions
          </button>
        </div>

        {loader && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}

        {showPreGenerated && !loader && (
          <div className="grid md:grid-cols-2 gap-4">
            {preGeneratedQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handlePreGeneratedSelect(quiz)}
                className={`
                  cursor-pointer p-4 border rounded-lg transition-all 
                  ${
                    selectedQuizzes.some((q) => q.id === quiz.id)
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                <h3 className="font-semibold mb-2">{quiz.que}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>A: {quiz.a}</div>
                  <div>B: {quiz.b}</div>
                  <div>C: {quiz.c}</div>
                  <div>D: {quiz.d}</div>
                </div>
                {selectedQuizzes.some((q) => q.id === quiz.id) && (
                  <div className="mt-2 text-green-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showExistingQuestions && !loader && (
          <div className="grid md:grid-cols-2 gap-4">
            {existingQuizzes.map((quiz, index) => (
              <div
                key={`${index}-${Date.now()}`}
                onClick={() => handleExistingQuestionSelect(quiz)}
                className={`
                  cursor-pointer p-4 border rounded-lg transition-all 
                  ${
                    selectedQuizzes.some((q) => q.id === quiz.id)
                      ? "bg-purple-100 border-purple-500"
                      : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                <h3 className="font-semibold mb-2">{quiz.que}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>A: {quiz.a}</div>
                  <div>B: {quiz.b}</div>
                  <div>C: {quiz.c}</div>
                  <div>D: {quiz.d}</div>
                </div>
                {selectedQuizzes.some((q) => q.id === quiz.id) && (
                  <div className="mt-2 text-purple-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showManualForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleManualQuizSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Question</label>
                <input
                  type="text"
                  value={newQuiz.que}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, que: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((option) => (
                  <div key={option}>
                    <label className="block mb-2">
                      Option {option.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={newQuiz[option]}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, [option]: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block mb-2">Correct Answer</label>
                <select
                  value={newQuiz.ans}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, ans: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Correct Option</option>
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Add Question
              </button>
            </form>
          </div>
        )}

        {selectedQuizzes.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
            >
              Review Questions ({selectedQuizzes.length})
            </button>
            <button
              onClick={nextRound}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Next Round
            </button>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Selected Questions</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                {selectedQuizzes.map((quiz, index) => (
                  <div key={quiz.id} className="border p-4 rounded bg-gray-50">
                    <h3 className="font-semibold mb-2">
                      Question {index + 1}: {quiz.que}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>A: {quiz.a}</div>
                      <div>B: {quiz.b}</div>
                      <div>C: {quiz.c}</div>
                      <div>D: {quiz.d}</div>
                    </div>
                    <div className="mt-2 text-green-600">
                      Correct Answer: Option {quiz.ans.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
