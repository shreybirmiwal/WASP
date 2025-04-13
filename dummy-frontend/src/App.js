// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import AsciiBee from './Components/AsciiBee';
import Dashboard from './Components/Dashboard';

function App() {
  const [websiteLink, setWebsiteLink] = useState('');
  const [task, setTask] = useState('');
  const [numAgents, setNumAgents] = useState(1);
  const [profiles, setProfiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setOutput(null);
    setError(null);

    try {
      const profileList = profiles.split(',').map(p => p.trim()).filter(Boolean);
      const response = await axios.post('/run-task', {
        website_link: websiteLink,
        task,
        num_agents: parseInt(numAgents) || 1,
        profiles: profileList.length > 0 ? profileList : ['default'],
      });
      setOutput(response.data);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const numberOfBees = 12;

  const handleReset = () => {
    setWebsiteLink('');
    setTask('');
    setNumAgents(1);
    setProfiles('');
    setOutput(null);
    setError(null);
    setLoading(false);
  }

  const showForm = !loading && !output && !error;
  const showDashboard = !loading && output;
  const showError = !loading && error; // Error will be shown below the form if form is visible, or on its own




  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* Render Bees - Always visible unless you hide them too */}

      {showForm && (

        Array.from({ length: numberOfBees }).map((_, index) => (
          <AsciiBee key={index} initialDelay={0} />
        ))

      )}


      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <p className="text-yellow-400 text-xl sm:text-2xl font-mono animate-pulse mb-3">
            Swarming Agents...
          </p>
          <p className="text-gray-400 text-sm sm:text-base">
            Simulating user testing task. This might take a minute...
          </p>
          {/* Optional Spinner */}
          <div className="mt-4 inline-block w-8 h-8 border-t-2 border-yellow-400 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Content Area - Conditionally render Form or Dashboard */}
      <div className="relative z-20 w-full max-w-5xl text-center flex flex-col items-center"> {/* Increased max-w for dashboard */}

        {/* --- FORM SECTION --- */}
        {showForm && (
          <>
            {/* Header */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light mb-2 text-yellow-400 font-mono tracking-widest">
              WASP
            </h1>
            <p className="text-gray-400 mb-8 md:mb-10 text-sm md:text-base">
              AI Agents for Automated User Testing
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col space-y-6">
              {/* Glassy Input Fields Container */}
              <div className="w-full p-6 md:p-8 bg-white/5 border border-white/20 rounded-xl backdrop-blur-md shadow-lg space-y-5">
                {/* Website Link Input */}
                <div>
                  <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-300 mb-1 text-left">
                    Website Link
                  </label>
                  <input
                    type="url"
                    id="websiteLink"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="w-full p-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500 transition duration-200"
                  />
                </div>

                {/* Task Input */}
                <div>
                  <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-1 text-left">
                    Task Description
                  </label>
                  <input
                    type="text"
                    id="task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="e.g., 'Sign up for a new account'"
                    required
                    className="w-full p-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500 transition duration-200"
                  />
                </div>

                {/* Agent & Profile Row */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-5 sm:space-y-0">
                  {/* Number of Agents Input */}
                  <div className="flex-1">
                    <label htmlFor="numAgents" className="block text-sm font-medium text-gray-300 mb-1 text-left">
                      Agents
                    </label>
                    <input
                      type="number"
                      id="numAgents"
                      value={numAgents}
                      onChange={(e) => setNumAgents(e.target.value)}
                      min="1"
                      required
                      className="w-full p-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500 transition duration-200"
                    />
                  </div>

                  {/* Profiles Input */}
                  <div className="flex-1">
                    <label htmlFor="profiles" className="block text-sm font-medium text-gray-300 mb-1 text-left">
                      Profiles <span className="text-xs text-gray-500">(comma-sep)</span>
                    </label>
                    <input
                      type="text"
                      id="profiles"
                      value={profiles}
                      onChange={(e) => setProfiles(e.target.value)}
                      placeholder="e.g., tech-savvy, beginner"
                      className="w-full p-3 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 placeholder-gray-500 transition duration-200"
                    />
                  </div>
                </div>
              </div> {/* End Glassy Container */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg
                  hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black
                  transition duration-200 ease-in-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Run Task
              </button>
            </form>

            {/* Error Display (shown below form if form is visible) */}
            {showError && (
              <div className="mt-8 w-full max-w-xl p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
                <button // Add reset button here too for convenience if an error occurs
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 transition duration-200 text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}

        {/* --- DASHBOARD SECTION --- */}
        {showDashboard && (
          <Dashboard output={output} onReset={handleReset} /> // Pass output and reset handler
        )}

        {/* --- STANDALONE ERROR DISPLAY (if form and dashboard are hidden) --- */}
        {/* This case might not happen with current logic but is good practice */}
        {showError && !showForm && !showDashboard && (
          <div className="mt-8 w-full max-w-xl p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 transition duration-200 text-sm"
            >
              Try Again
            </button>
          </div>
        )}


      </div> {/* End Main Content Area */}

      {/* Optional: Subtle gradient overlay at edges */}
      {/* These can stay as they are aesthetic */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
    </div>
  );
}

export default App;