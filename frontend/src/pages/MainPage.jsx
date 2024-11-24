import React from "react";
// import { ArrowRight } from "lucide-react";

const MainPage = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Transform Your Hiring
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              With AI-Powered Recruitment
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Revolutionize your recruitment process with intelligent candidate
            matching, automated screening, and data-driven hiring decisions.
          </p>

          {/* CTA button */}
          <div className="mt-10">
            <button className="group bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-200 transform hover:scale-105">
              Create a Smart Recruit
              {/* <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" /> */}
            </button>
          </div>

          {/* Optional Stats or Social Proof */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">2000+</div>
              <div className="text-gray-600 mt-1">Companies Trust Us</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-1">Hiring Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 mt-1">AI-Powered Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
