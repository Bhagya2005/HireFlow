import axios from "axios";
import { useRef, useEffect, useState } from "react";
import sendProgressEmail from "../components/NextroundEmail";
import sendRejectionEmail from "../components/RejectionEmail";
import "../index.css";
import * as faceapi from "face-api.js";

let currentPage = "entrance";

const QuizComponent = () => {
  const [userid, setuserid] = useState("");
  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const [jobrole, setJobrole] = useState("");
  const [hremail, setHremail] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || ""
  );
  const [candidatesEmail, setCandidatesEmails] = useState([]);

  const videoRef = useRef();
  const canvasRef = useRef();
  const [screenshot, setScreenshot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cheatComment, setCheatComment] = useState("");
  const [aptitudeTiming, setAptitudeTiming] = useState("");

  // New state for timer
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showCheatingModal, setShowCheatingModal] = useState(false);

  const cheatingDetecedByUser = async () => {
    try {
      console.log("Cheating detected by user");
      console.log("user: ", userid);
      console.log("cheatComment: ", cheatComment);

      const response = await axios.post(`${BACKEND_URL}/cheatingDetected`, {
        userId: userid,
        email: email,
        comment: cheatComment || "No comment provided",
        cheatImage: "image 1", // Replace with actual image data if available
      });

      console.log("Cheating response: ", response.data);
      // Optional: Reload the page to reflect updates
      // window.location.reload(true);
    } catch (error) {
      console.error("Error sending cheating email:", error);
    }
  };

  useEffect(() => {
    // Function to handle visibility change

    const handleVisibilityChange = () => {
      if (document.hidden && currentPage === "main") {
        console.log(
          "User has switched to another tab or minimized the browser."
        );
        setShowCheatingModal(true);
      }
    };

    // Add the event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadModels = () => {
    Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models")]).then(
      () => {
        detectFaces();
      }
    );
  };

  const takeScreenshot = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  const detectFaces = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const updateDetections = async () => {
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 512,
          scoreThreshold: 0.5,
        })
      );

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      resizedDetections.forEach((detection) => {
        const { x, y, width, height } = detection.box;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radius = Math.max(width, height) / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      if (detections.length >= 2 && !isModalOpen) {
        const screenshotData = takeScreenshot();
        setScreenshot(screenshotData);
        setIsModalOpen(true);
      }
    };

    video.addEventListener("play", () => {
      setInterval(updateDetections, 1000);
    });
  };

  const handleManualTrigger = () => {
    const screenshotData = takeScreenshot();
    setScreenshot(screenshotData);
    setIsModalOpen(true);
  };

  const handleCheatModalSubmit = () => {
    console.log("Cheat Comment:", cheatComment);
    setCheatComment("");
    setIsModalOpen(false);
    cheatingDetecedByUser();
  };

  // Start timer when quiz begins
  const startTimer = (minutes) => {
    setTimeRemaining(minutes * 60); // Convert minutes to seconds
    setIsTimerActive(true);
    currentPage = "main";
  };

  // Timer effect to countdown and auto-submit when time is up
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isTimerActive && timeRemaining === 0) {
      // Time is up, automatically submit the quiz
      clearInterval(interval);
      handleQuizSubmit();
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found in localStorage.");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/getUserInfo/${userId}`
        );
        console.log("Dashboard data:", response.data);
        setJobrole(response.data.jobRole);
        setHremail(response.data.email);
        setAptitudeTiming(response.data.aptitudeTime);

        const emails =
          response.data.candidateData?.map((candidate) => candidate.email) ||
          [];
        setCandidatesEmails(emails);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setScore(0); // Reset score before starting the quiz

    const candidateData = candidatesEmail;

    const candidateExists = candidateData.some(
      (candidate) => candidate === email
    );

    if (candidateExists) {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/getQuiz`, {
          params: { userId: userid },
        });
        console.log("Quiz Responses : ", response);
        setExistingQuizzes(response.data);
        setSubmitted(true);
        setLoading(false);

        // Start timer when quiz begins
        if (aptitudeTiming) {
          startTimer(parseInt(aptitudeTiming));
        }
      } catch (err) {
        setError("Failed to fetch quiz. Please try again.", err);
        setLoading(false);
      }
    } else {
      alert(
        "Give correct email, which you have given while applying to this job."
      );
    }
  };

  const handleAnswerSelect = (quizId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: selectedOption,
    }));

    const currentQuiz = existingQuizzes[quizId];
    if (currentQuiz && currentQuiz.ans === selectedOption) {
      setScore((prevScore) => prevScore + 1);
    } else if (currentQuiz && selectedAnswers[quizId] === currentQuiz.ans) {
      setScore((prevScore) => prevScore - 1);
    }
  };

  const handleQuizSubmit = async () => {
    const userId = userid;
    const userEmail = email;
    setemail(email);

    if (!userEmail) {
      setError("Email is required to send the rejection email.");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
      const user = response.data;
      const passingMarks = user.aptitudePassingMarks;

      console.log(
        `User's passing marks: ${passingMarks}, Your score: ${score}`
      );

      await axios.post(`${BACKEND_URL}/updateUser`, {
        userId,
        userEmail,
        score,
      });

      if (score >= passingMarks) {
        const templateParams = {
          subject: "Congratulations! You're Invited to the Technical Round",
          candidate_name: name,
          hr_email: hremail,
          roundName: "Technical Round",
          tech_link: `${BACKEND_URL}/techRound`,
          company_name: companyName,
          to_email: userEmail,
          recipient_address: email,
        };

        try {
          await sendProgressEmail(templateParams);
          console.log("Email sent successfully!");
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      } else {
        const templateParams = {
          job_role: jobrole,
          candidate_name: name,
          round_name: "Aptitude Round",
          company_name: companyName,
          to_email: userEmail,
        };

        try {
          await sendRejectionEmail(templateParams);
          console.log("Email sent successfully!");
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      }

      console.log(`Quiz completed! Your score: ${score}`);
      setSubmitted(false);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const renderUserDetailsForm = () => (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Enter Your Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="name"
            placeholder="User id"
            value={userid}
            onChange={(e) => setuserid(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.userid && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Start Quiz"}
        </button>
      </form>
    </div>
  );

  const renderQuizzes = () => (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      {/* Timer Display */}
      <div className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg">
        Time Remaining: {formatTime(timeRemaining)}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Quiz Questions
      </h2>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}
      {existingQuizzes.length > 0 ? (
        <>
          {existingQuizzes.map((quiz, index) => (
            <div
              key={quiz.id || index}
              className="bg-gray-50 p-5 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {quiz.que || `Question ${index + 1}`}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(index, option)}
                    className={`py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                      selectedAnswers[index] === option
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-800 border border-gray-300 hover:bg-blue-100"
                    }`}
                  >
                    {option.toUpperCase()}: {quiz[option]}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleQuizSubmit}
            disabled={
              loading ||
              Object.keys(selectedAnswers).length !== existingQuizzes.length
            }
            className="w-full mt-6 py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </>
      ) : (
        <p>No quizzes available</p>
      )}

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
                  cheatingDetecedByUser();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                You have been rejected, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {/* Fixed Video Stream Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col  items-center">
        <div className="relative mr-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-64 h-48 object-cover rounded-lg border-2 border-white shadow-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Manual Trigger Button */}
        <button
          onClick={handleManualTrigger}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Trigger Cheat Detection
        </button>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Modal for displaying screenshot and cheat comment */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
            <div className="bg-white p-8 rounded-lg w-96 max-w-md relative">
              {/* Close button positioned outside and to the top-right */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-3 -right-3 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">
                Potential Cheating Detected
              </h2>
              <img
                src={screenshot}
                alt="Screenshot"
                className="w-full rounded-lg mb-4"
              />
              <textarea
                value={cheatComment}
                onChange={(e) => setCheatComment(e.target.value)}
                placeholder="Want to say anything about this cheating?"
                className="w-full p-2 border rounded-lg mb-4 h-24 resize-none"
              />
              <button
                onClick={handleCheatModalSubmit}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Existing Quiz Content */}
        {!submitted ? renderUserDetailsForm() : renderQuizzes()}
      </div>
    </div>
  );
};

export default QuizComponent;
