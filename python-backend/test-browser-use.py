from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio
from dotenv import load_dotenv
load_dotenv()

# Define your Akash GPT API details
akash_api_key = "sk-uY7N8SRZ1M5WbSY3S4Qvlg"
akash_base_url = "https://chatapi.akash.network/api/v1"

async def main():
    # Create a ChatOpenAI instance with Akash GPT configurations
    llm = ChatOpenAI(
        model="Meta-Llama-4-Maverick-17B-128E-Instruct-FP8",  # Adjust the model as needed
        api_key=akash_api_key,
        base_url=akash_base_url,
    )
    
    agent = Agent(
        task="Compare the price of gpt-4o and DeepSeek-V3",
        llm=llm,
    )
    await agent.run()

asyncio.run(main())