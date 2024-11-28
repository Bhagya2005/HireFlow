import { useState } from 'react';

const RecruitmentDashboard = () => {
  const [activeRound, setActiveRound] = useState('aptitude');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const candidateData = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      aptitudeSelected: true,
      technicalRound: true,
      hrRound: false,
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com', 
      aptitudeSelected: false,
      technicalRound: false,
      hrRound: false,
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.johnson@example.com', 
      aptitudeSelected: true,
      technicalRound: true,
      hrRound: true,
    },
    { 
      id: 4, 
      name: 'Emily Brown', 
      email: 'emily.brown@example.com', 
      aptitudeSelected: true,
      technicalRound: false,
      hrRound: false,
    }
  ];

  const filteredCandidates = candidateData.filter(candidate => {
    const roundKey = activeRound + 'Selected';
    const nameMatch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
    const roundFilter = filterStatus === 'all' || 
           (filterStatus === 'selected' && candidate[roundKey]) ||
           (filterStatus === 'not-selected' && !candidate[roundKey]);
    
    return nameMatch && roundFilter;
  });

  const roundProgressMap = {
    aptitude: { color: 'bg-blue-500', text: 'Aptitude Round' },
    technical: { color: 'bg-green-500', text: 'Technical Round' },
    hr: { color: 'bg-purple-500', text: 'HR Round' }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-72 bg-white shadow-xl p-6 flex flex-col">
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 w-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            RC
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Recruitment Hub</h2>
        </div>

        <div className="mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Sarah Thompson</h3>
            <p className="text-sm text-gray-500">sarah.thompson@recruitech.com</p>
            <p className="text-sm text-gray-500">RecruitTech Solutions</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(roundProgressMap).map(([round, config]) => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
                ${activeRound === round 
                  ? `${config.color} scale-105` 
                  : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              {config.text}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8">
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
            <div 
              onClick={() => setFilterStatus(
                filterStatus === 'all' ? 'selected' : 
                filterStatus === 'selected' ? 'not-selected' : 
                'all'
              )}
              className="cursor-pointer bg-white shadow-md rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {filterStatus === 'all' ? '🔍 All Candidates' : 
               filterStatus === 'selected' ? '✅ Selected' : 
               '❌ Not Selected'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {filteredCandidates.slice(0, 4).map(candidate => (
            <div 
              key={candidate.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {candidate.name.charAt(0)}
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${candidate[activeRound + 'Round'] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {candidate[activeRound + 'Round'] ? 'Selected' : 'Rejected'}
                </span>
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