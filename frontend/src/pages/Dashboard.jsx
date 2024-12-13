import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, AlertTriangle, XCircle, Ban } from "lucide-react";

// Candidate Rejection Modal
const CandidateRejectionModal = ({ isOpen, onClose, candidate, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="bg-red-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Candidate Cheating Evidence</h2>
          <button
            onClick={onClose}
            className="hover:bg-red-600 p-2 rounded-full"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate Info */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="text-red-600" size={40} />
              <div>
                <h3 className="text-xl font-semibold text-red-800">
                  {candidate.name}
                </h3>
                <p className="text-red-700">{candidate.email}</p>
              </div>
            </div>
          </div>

          {/* Cheat Comment */}
          {candidate.cheatComment && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                Cheating Comment
              </h4>
              <p className="text-yellow-900">{candidate.cheatComment}</p>
            </div>
          )}

          {/* Cheat Image */}
          {candidate.cheatImage && (
            <div className="bg-gray-50 border-l-4 border-gray-500 p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Cheating Evidence
              </h4>
              <img
                src={candidate.cheatImage}
                alt="Cheating Evidence"
                className="w-full rounded-lg shadow-md max-h-[500px] object-contain"
              />
            </div>
          )}

          {/* Rejection Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onReject(candidate)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
            >
              <Ban size={20} />
              <span>Reject Candidate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email Modal Component
const EmailModal = ({
  isOpen,
  onClose,
  candidateEmail,
  cheatImage,
  cheatComment,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      await axios.post("/send-email", {
        to: candidateEmail,
        message,
      });
      alert("Email sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] p-6">
        <h2 className="text-xl font-bold mb-4">
          Send Email to {candidateEmail}
        </h2>
        <textarea
          className="w-full h-40 border rounded-lg p-2 mb-4"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Recruitment Dashboard
const RecruitmentDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/getUserInfo/${userId}`
        );

        const enrichedCandidates = response.data.candidateData.map(
          (candidate) => ({
            ...candidate,
            aptitudeStatus: response.data.aptitudePassesCandidates.includes(
              candidate.email
            )
              ? "Passed"
              : response.data.aptitudeFailedCandidates.includes(candidate.email)
              ? "Failed"
              : "Pending",
            techStatus: response.data.techPassesCandidates.includes(
              candidate.email
            )
              ? "Passed"
              : response.data.techFailedCandidates.includes(candidate.email)
              ? "Failed"
              : "Pending",
            hrStatus: "Pending",
            isCheating: !!(candidate.cheatImage || candidate.cheatComment),
          })
        );

        setCandidates(enrichedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleRejectCandidate = async (candidate) => {
    try {
      // Send rejection email
      await axios.post("/reject-candidate", {
        email: candidate.email,
        name: candidate.name,
      });

      // Update candidate status or remove from list
      setCandidates(candidates.filter((c) => c.email !== candidate.email));

      // Close modals
      setRejectionModalOpen(false);

      // Show success message
      alert(`Candidate ${candidate.name} has been rejected`);
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      alert("Failed to reject candidate");
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Passed":
        return "text-green-600";
      case "Failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const openEmailModal = (candidate) => {
    setSelectedCandidate(candidate);
    setEmailModalOpen(true);
  };

  const openRejectionModal = (candidate) => {
    setSelectedCandidate(candidate);
    setRejectionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <div className="bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Candidate Management
            </h1>
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-80"
            />
          </div>

          {/* Candidate Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Aptitude Round</th>
                  <th className="px-6 py-3 text-left">Technical Round</th>
                  <th className="px-6 py-3 text-left">HR Round</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.email}
                    className={`border-b hover:bg-gray-50 ${
                      candidate.isCheating ? "bg-red-50 hover:bg-red-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium flex items-center">
                      {candidate.isCheating && (
                        <button
                          onClick={() => openRejectionModal(candidate)}
                          className="mr-2 text-red-500 hover:text-red-700 transition"
                        >
                          <AlertTriangle size={20} />
                        </button>
                      )}
                      {candidate.name}
                    </td>
                    <td className="px-6 py-4">{candidate.email}</td>
                    <td
                      className={`px-6 py-4 ${getStatusColor(
                        candidate.aptitudeStatus
                      )}`}
                    >
                      {candidate.aptitudeStatus}
                    </td>
                    <td
                      className={`px-6 py-4 ${getStatusColor(
                        candidate.techStatus
                      )}`}
                    >
                      {candidate.techStatus}
                    </td>
                    <td
                      className={`px-6 py-4 ${getStatusColor(
                        candidate.hrStatus
                      )}`}
                    >
                      {candidate.hrStatus}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => openEmailModal(candidate)}
                          className={`hover:text-blue-700 ${
                            candidate.isCheating
                              ? "text-red-500 hover:text-red-700"
                              : "text-blue-500"
                          }`}
                        >
                          <Mail size={24} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        candidateEmail={selectedCandidate?.email || ""}
      />

      {/* Candidate Rejection Modal */}
      <CandidateRejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        candidate={selectedCandidate || {}}
        onReject={handleRejectCandidate}
      />
    </div>
  );
};

export default RecruitmentDashboard;
