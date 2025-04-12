from flask import Flask, request, jsonify
from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Akash GPT API info
akash_api_key = os.getenv("AKASH_API_KEY", "sk-uY7N8SRZ1M5WbSY3S4Qvlg")
akash_base_url = os.getenv("AKASH_BASE_URL", "https://chatapi.akash.network/api/v1")

# Define async task runner
async def run_agent_task(task, website_link, agent_id):
    llm = ChatOpenAI(
        model="Meta-Llama-4-Maverick-17B-128E-Instruct-FP8",
        api_key=akash_api_key,
        base_url=akash_base_url,
    )
    
    agent = Agent(
        task=f"{task} on {website_link} (Agent {agent_id})",
        llm=llm,
    )
    result = await agent.run()
    return {"agent_id": agent_id, "result": result}

@app.route("/run-task", methods=["POST"])
def run_task():
    try:
        data = request.get_json()
        print("Received request data:", data)  # Log incoming request data
        
        website_link = data.get("website_link")
        task = data.get("task")
        num_agents = int(data.get("num_agents", 1))

        print(f"Extracted parameters - Website: {website_link}, Task: {task}, Number of Agents: {num_agents}")  # Log extracted parameters

        if not website_link or not task:
            print("Missing website_link or task")  # Log missing parameters
            return jsonify({"error": "Missing website_link or task"}), 400

        print(f"Running task: {task} on {website_link} with {num_agents} agents")

        async def run_all_agents():
            tasks = [
                run_agent_task(task, website_link, i +1)
                for i in range(num_agents)
            ]
            print("Running all agent tasks...")  # Log before running tasks
            results = await asyncio.gather(*tasks)
            print("Completed all agent tasks.")  # Log after running tasks
            return results

        # Run all agents in event loop
        results = asyncio.run(run_all_agents())
        print("Task results:", results)  # Log task results
        return jsonify({"status": "success", "agents": results}), 200

    except Exception as e:
        print("Exception occurred:", str(e))  # Log exceptions
        return jsonify({"error": str(e)}), 500


@app.route("/")
def index():
    return "Hello World"

if __name__ == "__main__":
    app.run(debug=True)
