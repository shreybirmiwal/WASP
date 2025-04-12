import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [websiteLink, setWebsiteLink] = useState('');
  const [task, setTask] = useState('');
  const [numAgents, setNumAgents] = useState('');
  const [profiles, setProfiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/run-task', {
        website_link: websiteLink,
        task,
        num_agents: parseInt(numAgents),
        profiles: profiles.split(','),
      });
      setOutput(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>UTProductHack</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Website Link:
          <input type="text" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} />
        </label>
        <br />
        <label>
          Task:
          <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
        </label>
        <br />
        <label>
          Number of Agents:
          <input type="number" value={numAgents} onChange={(e) => setNumAgents(e.target.value)} />
        </label>
        <br />
        <label>
          Profiles (comma-separated):
          <input type="text" value={profiles} onChange={(e) => setProfiles(e.target.value)} />
        </label>
        <br />
        <button type="submit">Run Task</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : output ? (
        <div>
          <h2>Output</h2>
          <pre>{JSON.stringify(output, null, 2)}</pre>
          <Dashboard output={output} />
        </div>
      ) : null}
    </div>
  );
}

const Dashboard = ({ output }) => {
  // Simple dashboard implementation
  const agents = output.agents;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Status: {output.status}</p>
      <h3>Agents</h3>
      {agents.map((agent, index) => {
        const agentData = Object.values(agent)[0];
        return (
          <div key={index}>
            <h4>Agent {agentData.agentID}</h4>
            <p>Profile: {agentData.profile}</p>
            <p>Score of Usability: {agentData.compressed_output[0].score_of_usability}</p>
            <p>Time Taken: {agentData.compressed_output[0].time_taken}</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;



