// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is installed: npm install axios
import AsciiBee from './Components/AsciiBee';
import AsciiLoader from './Components/AsciiLoader';


// No need for a separate Dashboard component definition here anymore
// We'll integrate its rendering logic directly below

function App() {
  const [websiteLink, setWebsiteLink] = useState('');
  const [task, setTask] = useState('');
  const [numAgents, setNumAgents] = useState(1); // Default to 1
  const [profiles, setProfiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null); // State for API errors

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setOutput(null); // Clear previous output
    setError(null); // Clear previous error

    try {
      const profileList = profiles.split(',').map(p => p.trim()).filter(Boolean); // Clean up profiles
      const response = await axios.post('/run-task', { // Your API endpoint
        website_link: websiteLink,
        task,
        num_agents: parseInt(numAgents) || 1, // Ensure it's a number
        profiles: profileList.length > 0 ? profileList : ['default'], // Send default if empty
      });
      setOutput(response.data);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || err.message || 'An unknown error occurred.'); // Display error message
    } finally {
      setLoading(false);
    }
  };

  // Configuration for Bees
  const numberOfBees = 12; // Adjust number of bees

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* Render Bees - positioned absolutely */}
      {Array.from({ length: numberOfBees }).map((_, index) => (
        <AsciiBee key={index} initialDelay={index * 200} /> // Stagger initial appearance
      ))}

      {/* Main Content Area - high z-index to be above bees */}
      <div className="relative z-20 w-full max-w-3xl text-center flex flex-col items-center">

        {/* Header */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light mb-2 text-yellow-400 font-mono tracking-widest">
          WASP
        </h1>
        <p className="text-gray-400 mb-8 md:mb-10 text-sm md:text-base">
          AI Agents for Automated User Testing
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col items-center space-y-6">
          {/* Glassy Input Fields Container */}
          <div className="w-full p-6 md:p-8 bg-white/5 border border-white/20 rounded-xl backdrop-blur-md shadow-lg space-y-5">
            {/* Website Link Input */}
            <div>
              <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Website Link
              </label>
              <input
                type="url" // Use type="url" for better validation
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

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              mt-6 px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg
              hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black
              transition duration-200 ease-in-out
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? 'Swarming...' : 'Run Task'}
          </button>
        </form>

        {/* Loading Indicator */}
        {loading && <AsciiLoader />}

        {/* Error Display */}
        {error && !loading && (
          <div className="mt-8 w-full max-w-xl p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}


        {/* Output Display Area */}
        {output && !loading && (
          <div className="mt-10 w-full text-left space-y-6">

            {/* Raw JSON Output */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-yellow-400">Raw Output</h2>
              <pre className="bg-gray-900/70 border border-gray-700 p-4 rounded-lg overflow-x-auto text-sm custom-scrollbar">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>

            {/* Integrated Dashboard Section */}
            <div className="p-4 md:p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">Dashboard Summary</h2>
              {/* General Status (if available) */}
              {output.status && (
                <p className="mb-4">
                  <span className="font-medium text-gray-300">Overall Status:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-sm ${output.status === 'Completed' ? 'bg-green-700 text-green-100' : 'bg-blue-700 text-blue-100'}`}>
                    {output.status}
                  </span>
                </p>
              )}

              {/* Agent Details */}
              <h3 className="text-lg font-medium mb-3 text-gray-200 border-b border-gray-600 pb-1">Agent Results</h3>
              {output.agents && Array.isArray(output.agents) ? (
                <div className="space-y-4">
                  {output.agents.map((agent, index) => {
                    // Handle the specific structure you had: { "Agent X": { ... } }
                    const agentKey = Object.keys(agent)[0]; // e.g., "Agent 0"
                    const agentData = agent[agentKey];

                    // Safely access nested data
                    const usabilityScore = agentData?.compressed_output?.[0]?.score_of_usability;
                    const timeTaken = agentData?.compressed_output?.[0]?.time_taken;

                    return (
                      <div key={index} className="p-3 bg-black/20 border border-gray-600 rounded-md">
                        <h4 className="font-semibold text-yellow-500">{agentKey || `Agent ${index + 1}`}</h4>
                        {agentData?.profile && <p className="text-sm text-gray-300">Profile: <span className="text-gray-100">{agentData.profile}</span></p>}
                        {usabilityScore !== undefined && <p className="text-sm text-gray-300">Usability Score: <span className="text-gray-100">{usabilityScore}</span></p>}
                        {timeTaken !== undefined && <p className="text-sm text-gray-300">Time Taken: <span className="text-gray-100">{timeTaken}</span></p>}
                        {/* Add more fields from agentData or compressed_output as needed */}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400">No agent data found or data is in an unexpected format.</p>
              )}
            </div> {/* End Dashboard Section */}

          </div> // End Output Display Area
        )}
      </div> {/* End Main Content Area */}

      {/* Optional: Subtle gradient overlay at edges */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
    </div>
  );
}

export default App;