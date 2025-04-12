from flask import Flask, request, jsonify
from langchain_openai import ChatOpenAI
from browser_use import Agent, SystemPrompt, Controller
from pydantic import BaseModel
import asyncio
from dotenv import load_dotenv
import os
import time
from typing import List, Dict, Optional
import random
from openai import OpenAI
import json

load_dotenv()

print("Loading environment variables...")
print("OPENROUTER_API_KEY:", os.getenv("OPENROUTER_API_KEY"))

akash_api_key = "sk-uY7N8SRZ1M5WbSY3S4Qvlg"
akash_base_url = "https://chatapi.akash.network/api/v1"
akash_model = "Meta-Llama-4-Maverick-17B-128E-Instruct-FP8"


structured_client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key = os.getenv("OPENROUTER_API_KEY"),
)


app = Flask(__name__)

# Define structured output format for UX data
class UXMetric(BaseModel):
    element_found: bool
    time_taken: float
    confusion_points: List[str]
    path_taken: List[str]
    success: bool
    issues_encountered: List[str]

class UXTestResult(BaseModel):
    task_description: str
    success: bool
    steps_taken: int
    ux_metrics: UXMetric
    screenshots: List[str]
    visited_urls: List[str]
    final_feedback: Optional[str]

# Custom system prompt for UX testing
class UXSystemPrompt(SystemPrompt):
    def important_rules(self) -> str:
        base_rules = super().important_rules()
        return f"""{base_rules}
        8. CRITICAL UX COLLECTION RULES:
        - Always track time taken for each action
        - Note any interface elements that caused confusion
        - Record alternative paths considered
        - Identify elements that were hard to find
        - Document any usability issues encountered
        - Estimate user frustration level on scale 1-5
        """


async def run_agent_task(task, website_link, agent_id, profile):
    llm = ChatOpenAI(
        model=akash_model,
        api_key=akash_api_key,
        base_url=akash_base_url,  
    )
    
    agent = Agent(
        task=f"{task} on {website_link} (Agent {agent_id}). You are to pretend you are a {profile}, doing what a common {profile} would do on this website - to simulate UX resaerch",
        llm=llm,
        system_prompt_class=UXSystemPrompt,
        controller=Controller(output_model=UXTestResult)
    )
    
    history = await agent.run()    
    compressed_output = compress_history(str(history), profile, task)
    
    return {"Agent_"+str(agent_id) : {"agentID": agent_id,"query":task, "profile": profile, "compressed_output": compressed_output}}

def compress_history(output, profile, question):

    print("Compressing history...")  # Log before compression
    
    prompt = f"""
    You are observing a user interacting with a website. Your job is to understand their actions and extract information relavent to a UXR researcher.

    The question they were asked was {question}
    The user is a {profile}.
    This is the history of the user's actions:
    {output}

    
    Your output should be in the following format:

    json
    [
    "path_taken": "The path the user took",
    "feedback": "Assume the role of the user and give feedback on the website as if you were a user in the profile",
    "issues_encountered": "Any issues the user encountered",
    "score_of_usability": "A score of usability from 1 to 10",
    "time_taken": "The time taken to complete the task",
    ]
    

    """

    completion = structured_client.chat.completions.create(

    model="google/gemini-2.5-pro-exp-03-25:free",
    messages=[
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": prompt
            },
        ]
        }
    ],
    response_format= { "type": "json_object" } 
    
    )
    print(completion.choices[0].message.content)

    return json.loads(completion.choices[0].message.content)



@app.route("/run-task", methods=["POST"])
def run_task():
    try:
        data = request.get_json()
        print("Received request data:", data)  # Log incoming request data
        
        website_link = data.get("website_link")
        task = data.get("task")
        num_agents = int(data.get("num_agents", 1))
        profiles = data.get("profiles", ["normal person"])

        print(f"Extracted parameters - Website: {website_link}, Task: {task}, Number of Agents: {num_agents}")  # Log extracted parameters

        if not website_link or not task:
            print("Missing website_link or task")  # Log missing parameters
            return jsonify({"error": "Missing website_link or task"}), 400

        print(f"Running task: {task} on {website_link} with {num_agents} agents")

        async def run_all_agents():
            tasks = [
                run_agent_task(task, website_link, i + 1, random.choice(profiles))
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
    app.run(port=8000, debug=True)
