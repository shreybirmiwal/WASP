// src/Components/Dashboard.jsx
import React from 'react';
import { processDashboardData } from './DashboardUtils'; // Import the utility function
import AgentCard from './AgentCard';

function Dashboard({ output, onReset }) { // Added onReset prop
    const data = processDashboardData(output);

    if (data.error) {
        return (
            <div className="mt-10 w-full max-w-4xl text-left p-6 bg-red-900/40 border border-red-700 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-red-300">Dashboard Error</h2>
                <p className="text-red-200">{data.error}</p>
                <button
                    onClick={onReset}
                    className="mt-4 px-4 py-2 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 transition duration-200"
                >
                    Run New Test
                </button>
            </div>
        );
    }

    const handleDownloadJson = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data.rawOutput, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "wasp_output.json";
        link.click();
    };

    return (
        <div className="relative z-20 w-full max-w-5xl text-left space-y-8 mt-10 px-4">

            {/* Header and Actions */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <h1 className="text-3xl font-light text-yellow-400 font-mono tracking-wide">
                    WASP Test Results
                </h1>
                <div className="flex space-x-3">
                    <button
                        onClick={handleDownloadJson}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200 text-sm"
                    >
                        Download Raw JSON
                    </button>
                    <button
                        onClick={onReset} // Use the reset function passed from App
                        className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition duration-200 text-sm"
                    >
                        Run New Test
                    </button>
                </div>
            </div>

            {/* --- Overall Summary --- */}
            <section className="p-4 md:p-6 bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-yellow-400 border-b border-gray-600 pb-2">Overall Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div><span className="font-medium text-gray-300">Task Tested:</span><p className="text-gray-100 break-words">{data.query || 'N/A'}</p></div>
                    <div><span className="font-medium text-gray-300">Total Agents:</span><p className="text-gray-100 text-lg font-bold">{data.totalAgents}</p></div>
                    <div><span className="font-medium text-gray-300">Avg. Usability Score:</span><p className="text-gray-100 text-lg font-bold">{data.averageScore} <span className='text-xs text-gray-400'>/ 10</span></p></div>
                    <div><span className="font-medium text-gray-300">Avg. Time Taken:</span><p className="text-gray-100 text-lg font-bold">{data.averageTime} <span className='text-xs text-gray-400'>sec</span></p></div>
                </div>
            </section>

            {/* --- Key Insights & Analytics --- */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-500">Usability Score Distribution</h3>
                    {Object.keys(data.scoreDistribution).length > 0 ? (
                        <div className="space-y-1 text-sm">
                            {Object.entries(data.scoreDistribution)
                                .sort(([scoreA], [scoreB]) => parseInt(scoreA) - parseInt(scoreB)) // Sort scores numerically
                                .map(([score, count]) => (
                                    <div key={score} className="flex justify-between items-center">
                                        <span className="text-gray-300">Score {score}:</span>
                                        <span className="text-gray-100 font-medium">{count} agent{count > 1 ? 's' : ''}</span>
                                        {/* Basic bar visualization */}
                                        <div className="w-1/2 bg-gray-600 rounded h-2 ml-2">
                                            <div className="bg-yellow-400 h-2 rounded" style={{ width: `${(count / data.totalAgents) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No score data available.</p>
                    )}
                </div>

                {/* Common Issues */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-500">Top Common Issues</h3>
                    {data.sortedCommonIssues.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-200">
                            {data.sortedCommonIssues.map(([issue, count]) => (
                                <li key={issue}>
                                    {issue} <span className="text-xs text-gray-400">({count} instance{count > 1 ? 's' : ''})</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm">No specific issues were frequently reported.</p>
                    )}
                </div>

                {/* Profile Comparison */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-500">Performance by Profile</h3>
                    {data.profileStats.length > 0 ? (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-2">Profile</th>
                                        <th scope="col" className="px-4 py-2 text-center">Agent Count</th>
                                        <th scope="col" className="px-4 py-2 text-center">Avg. Score</th>
                                        <th scope="col" className="px-4 py-2 text-center">Avg. Time (sec)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.profileStats.map(stat => (
                                        <tr key={stat.profile} className="border-b border-gray-700 hover:bg-gray-700/30">
                                            <td className="px-4 py-2 font-medium text-gray-100">{stat.profile}</td>
                                            <td className="px-4 py-2 text-center text-gray-200">{stat.count}</td>
                                            <td className="px-4 py-2 text-center text-gray-200">{stat.averageScore}</td>
                                            <td className="px-4 py-2 text-center text-gray-200">{stat.averageTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No profile data available for comparison.</p>
                    )}
                </div>
            </section>

            {/* --- Individual Agent Results --- */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-yellow-400 border-b border-gray-600 pb-2">Agent Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.agents.map((agent) => (
                        <AgentCard key={agent.id || agent.key} agent={agent} />
                    ))}
                </div>
            </section>

        </div>
    );
}

export default Dashboard;