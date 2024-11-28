import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const AptitudeInfo = () => {
  const navigate = useNavigate();
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [preGeneratedQuizzes, setPreGeneratedQuizzes] = useState();
  const [loader, setLoader] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    ans: "",
  });

  function generateQuiz() {
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
  }

  function getAlreadyGeneratedQuiz() {
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
  }

  const handlePreGeneratedSelect = (quiz) => {
    setSelectedQuizzes((prevSelectedQuizzes) => {
      if (prevSelectedQuizzes.find((q) => q.id === quiz.id)) {
        return prevSelectedQuizzes.filter((q) => q.id !== quiz.id);
      } else {
        return [...prevSelectedQuizzes, quiz];
      }
    });
  };

  const handleManualQuizSubmit = (e) => {
    e.preventDefault();
    const newQuizWithId = {
      ...newQuiz,
      id: Date.now(),
    };
    setSelectedQuizzes([...selectedQuizzes, newQuizWithId]);
    console.log(newQuiz);
    setNewQuiz({
      id: Date.now(),
      question: "",
      que: "",
      a: "",
      b: "",
      c: "",
      d: "",
      ans: "",
    });
  };

  const handleClickNextRound = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Quiz Manager
        </h1>

        {/* Initial Buttons - Always Visible */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowPreGenerated(!showPreGenerated);
              setShowManualForm(false);
              generateQuiz();
            }}
            className={`py-4 px-8 rounded-lg transition-all text-lg font-semibold ${
              showPreGenerated
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Generated New Questions
          </button>
          <button
            onClick={() => {
              setShowPreGenerated(!showPreGenerated);
              setShowManualForm(false);
              getAlreadyGeneratedQuiz();
            }}
            className={`py-4 px-8 rounded-lg transition-all text-lg font-semibold ${
              showPreGenerated
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            View Already Generated Questions Use by other Recruiter
          </button>
          <button
            onClick={() => {
              setShowManualForm(!showManualForm);
              setShowPreGenerated(false);
              generateQuiz();
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

        {/* Content Area */}
        <div className="space-y-8">
          {/* Pre-generated Questions Section */}
          {showPreGenerated && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Pre-generated Questions
              </h2>
              <div className="h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {loader && <div className="loader">Generating Quiz...</div>}
                  {preGeneratedQuizzes?.map((quiz) => (
                    <div
                      key={quiz.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
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
                Create New Question
              </h2>
              <form onSubmit={handleManualQuizSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    value={newQuiz.que}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, question: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option A
                    </label>
                    <input
                      type="text"
                      value={newQuiz.a}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, a: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option B
                    </label>
                    <input
                      type="text"
                      value={newQuiz.b}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, b: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option C
                    </label>
                    <input
                      type="text"
                      value={newQuiz.c}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, c: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option D
                    </label>
                    <input
                      type="text"
                      value={newQuiz.d}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, d: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer (a, b, c, or d)
                  </label>
                  <select
                    value={newQuiz.ans}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, ans: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select answer</option>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Question
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Selected Questions Count */}
        {selectedQuizzes.length > 0 && (
          <div className="flex justify-center mt-10 mb-8">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-600 transition-all"
            >
              Review Selected Questions ({selectedQuizzes.length})
            </button>
          </div>
        )}

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

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full h-[80vh] flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Selected Questions Review
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {selectedQuizzes.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No questions selected yet
                  </p>
                ) : (
                  <div className="space-y-6">
                    {selectedQuizzes.map((quiz, index) => (
                      <div
                        key={quiz.id}
                        className="p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="font-semibold text-gray-700 mb-2">
                          Question {index + 1}: {quiz.que}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">A: {quiz.a}</div>
                          <div className="text-gray-600">B: {quiz.b}</div>
                          <div className="text-gray-600">C: {quiz.c}</div>
                          <div className="text-gray-600">D: {quiz.d}</div>
                        </div>
                        <div className="mt-2 text-sm font-medium text-green-600">
                          Correct Answer: Option {quiz.ans.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeInfo;
