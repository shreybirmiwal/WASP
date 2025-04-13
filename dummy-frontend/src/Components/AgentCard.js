// src/Components/AgentCard.jsx
import React, { useState } from 'react';

// Helper to assign color based on score (adjust thresholds as needed)
const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-400';
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
};

function AgentCard({ agent }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const scoreColor = getScoreColor(agent.score);

    return (
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 shadow-md transition-all duration-300 hover:bg-gray-700/70">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-lg font-semibold text-yellow-400">{agent.key}</h4>
                    <p className="text-sm text-gray-300">Profile: <span className="font-medium text-gray-100">{agent.profile}</span></p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-2 py-1 rounded"
                >
                    {isExpanded ? 'Collapse' : 'Details'}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="flex space-x-4 text-sm mb-3">
                <p className="text-gray-300">
                    Usability Score: <span className={`font-bold text-base ${scoreColor}`}>{agent.score ?? 'N/A'}</span>
                    <span className="text-xs text-gray-400"> / 10</span> {/* Assuming 10 is max */}
                </p>
                <p className="text-gray-300">
                    Time Taken: <span className="font-bold text-base text-gray-100">{agent.time ?? 'N/A'}</span>
                    <span className="text-xs text-gray-400"> sec</span>
                </p>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-gray-600 space-y-3 text-sm">
                    <div>
                        <h5 className="font-semibold text-gray-300 mb-1">Feedback:</h5>
                        <p className="text-gray-200 bg-black/20 p-2 rounded text-xs max-h-40 overflow-y-auto custom-scrollbar">{agent.feedback}</p>
                    </div>
                    {agent.issues.length > 0 && (
                        <div>
                            <h5 className="font-semibold text-gray-300 mb-1">Issues Encountered ({agent.issues.length}):</h5>
                            <ul className="list-disc list-inside pl-2 text-gray-200 space-y-1 text-xs">
                                {agent.issues.map((issue, index) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {agent.path.length > 0 && (
                        <div>
                            <h5 className="font-semibold text-gray-300 mb-1">Path Taken ({agent.path.length} steps):</h5>
                            <ol className="list-decimal list-inside pl-2 text-gray-200 space-y-1 text-xs max-h-40 overflow-y-auto custom-scrollbar">
                                {agent.path.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AgentCard;