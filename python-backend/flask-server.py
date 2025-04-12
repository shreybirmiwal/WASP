#to do:
# 1. make differnet personalities for each agent
#2 . make each agent output return in clean GPT format with explaining: 1. path, 2. issues, 3. feedback and 4. score for personality


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

akash_api_key = "sk-uY7N8SRZ1M5WbSY3S4Qvlg"
akash_base_url = "https://chatapi.akash.network/api/v1"

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
        model="Meta-Llama-4-Maverick-17B-128E-Instruct-FP8",
        api_key=akash_api_key,
        base_url=akash_base_url,
    )
    
    agent = Agent(
        task=f"{task} on {website_link} (Agent {agent_id}). You are to pretend you are a {profile}, doing what a common {profile} would do on this website - to simulate UX resaerch",
        llm=llm,
        system_prompt_class=UXSystemPrompt,
        save_conversation_path=f"ux_logs/agent_{agent_id}_{int(time.time())}",
        controller=Controller(output_model=UXTestResult)
    )
    
    history = await agent.run()    

    return {"Agent_"+str(agent_id) : {"profile": profile, "history": str(history)}}


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
    


def compress_history(output, profile, question):

    # call openai api to compress history
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=akash_api_key,
        base_url=akash_base_url,
    )

    prompt = f"""
    You are observing a user interacting with a website. Your job is to understand their actions and extract information relavent to a UXR researcher.

    The question they were asked was {question}
    The user is a {profile}.
    This is the history of the user's actions:
    {output}

    
    Your output should be in the following format:
    
    Path taken:
    Issues encountered:
    Feedback (generate some feedback what the user might give feedback on, focus on the user profile specifically):
    Score of usability:
    Time taken:

    """

    response = llm.invoke(prompt)
    return response.content


@app.route("/")
def index():
    return "Hello World"

if __name__ == "__main__":
    app.run(debug=True)