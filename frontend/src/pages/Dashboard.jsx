import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, CheckCircle, XCircle } from "lucide-react";

// Email Modal Component
const EmailModal = ({ isOpen, onClose, candidateEmail }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      // Implement email sending logic here
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
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6">
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
            hrStatus: "Pending", // Assuming HR status is not yet implemented
          })
        );

        setCandidates(enrichedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

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
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">{candidate.name}</td>
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
                      <button
                        onClick={() => openEmailModal(candidate)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Mail size={24} />
                      </button>
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
    </div>
  );
};

export default RecruitmentDashboard;
