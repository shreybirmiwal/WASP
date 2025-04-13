// src/utils/dashboardUtils.js

// Helper to safely parse score string to number
const parseScore = (scoreStr) => {
    const score = parseInt(scoreStr, 10);
    return isNaN(score) ? null : score;
};

// Helper to safely parse time string ("120.0 seconds") to number
const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const match = timeStr.match(/([\d.]+)\s*seconds/i);
    if (match && match[1]) {
        const time = parseFloat(match[1]);
        return isNaN(time) ? null : time;
    }
    return null;
};

// Main function to process data for the dashboard
export const processDashboardData = (output) => {
    if (!output || !output.agents || !Array.isArray(output.agents)) {
        return { error: 'Invalid output format' };
    }

    const agentsData = output.agents.map(agentObj => {
        const agentKey = Object.keys(agentObj)[0];
        const data = agentObj[agentKey];
        const compressed = data?.compressed_output?.[0]; // Assuming one compressed output

        return {
            id: data?.agentID,
            key: agentKey || `Agent_${data?.agentID || 'Unknown'}`,
            profile: data?.profile || 'N/A',
            query: data?.query || 'N/A',
            feedback: compressed?.feedback || 'N/A',
            issues: compressed?.issues_encountered || [],
            path: compressed?.path_taken || [],
            rawScore: compressed?.score_of_usability,
            rawTime: compressed?.time_taken,
            score: parseScore(compressed?.score_of_usability),
            time: parseTime(compressed?.time_taken),
        };
    }).filter(agent => agent.id !== undefined); // Filter out potentially malformed agent entries

    if (agentsData.length === 0) {
        return { error: 'No valid agent data found' };
    }

    // Calculate overall stats
    const validScores = agentsData.map(a => a.score).filter(s => s !== null);
    const validTimes = agentsData.map(a => a.time).filter(t => t !== null);

    const averageScore = validScores.length > 0
        ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1)
        : 'N/A';

    const averageTime = validTimes.length > 0
        ? (validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length).toFixed(1)
        : 'N/A';

    // Calculate score distribution
    const scoreDistribution = validScores.reduce((dist, score) => {
        dist[score] = (dist[score] || 0) + 1;
        return dist;
    }, {});

    // Aggregate common issues
    const allIssues = agentsData.flatMap(a => a.issues);
    const commonIssues = allIssues.reduce((counts, issue) => {
        counts[issue] = (counts[issue] || 0) + 1;
        return counts;
    }, {});
    const sortedCommonIssues = Object.entries(commonIssues)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5); // Top 5

    // Calculate profile-based stats
    const profiles = [...new Set(agentsData.map(a => a.profile))];
    const profileStats = profiles.map(profile => {
        const agentsInProfile = agentsData.filter(a => a.profile === profile);
        const profileScores = agentsInProfile.map(a => a.score).filter(s => s !== null);
        const profileTimes = agentsInProfile.map(a => a.time).filter(t => t !== null);

        const avgScore = profileScores.length > 0
            ? (profileScores.reduce((sum, score) => sum + score, 0) / profileScores.length).toFixed(1)
            : 'N/A';
        const avgTime = profileTimes.length > 0
            ? (profileTimes.reduce((sum, time) => sum + time, 0) / profileTimes.length).toFixed(1)
            : 'N/A';

        return {
            profile,
            count: agentsInProfile.length,
            averageScore: avgScore,
            averageTime: avgTime,
        };
    });

    return {
        totalAgents: agentsData.length,
        query: agentsData[0]?.query, // Assume same query for all
        averageScore,
        averageTime,
        scoreDistribution,
        sortedCommonIssues,
        profileStats,
        agents: agentsData, // Processed agent data
        rawOutput: output, // Include original for download
    };
};