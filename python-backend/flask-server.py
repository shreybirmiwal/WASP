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
        website_link = data.get("website_link")
        task = data.get("task")
        num_agents = int(data.get("num_agents", 1))

        if not website_link or not task:
            return jsonify({"error": "Missing website_link or task"}), 400

        async def run_all_agents():
            tasks = [
                run_agent_task(task, website_link, i + 1)
                for i in range(num_agents)
            ]
            results = await asyncio.gather(*tasks)
            return results

        # Run all agents in event loop
        results = asyncio.run(run_all_agents())
        return jsonify({"status": "success", "agents": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
