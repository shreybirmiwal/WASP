// src/App.js
import React, { useState } from 'react';

function App() {
  const [website, setWebsite] = useState('');
  const [tasks, setTasks] = useState('');
  const [numAgents, setNumAgents] = useState('');

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:5000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          website,
          tasks,
          numAgents
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    console.log('Input data:');
    console.log('Website:', website);
    console.log('Tasks:', tasks);
    console.log('Number of agents:', numAgents);
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-6 lg:p-8 mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Create a new task</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
            Website
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="website"
            type="text"
            placeholder="Enter website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tasks">
            Tasks
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="tasks"
            placeholder="Enter tasks (comma separated)"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numAgents">
            Number of agents
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numAgents"
            type="number"
            placeholder="Enter number of agents"
            value={numAgents}
            onChange={(e) => setNumAgents(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleCreate}
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default App;