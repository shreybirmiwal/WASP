# utproducthack


input data:
POST http://127.0.0.1:8000/run-task
{
  "website_link": "https://docs.base.org",
  "task": "How would you find where to launch a token",
  "num_agents": 1,
  "profiles": ["Grandma", "Normal person", "color blind person"]
}



OUTPUT data:

{
    "agents": [
        {
            "Agent_1": {
                "compressed_output": [
                    {
                        "feedback": "I went to the website to figure out how to launch a token. After handling the cookie settings, I wasn't immediately sure where to go, so I clicked on a link that looked interesting but wasn't right. Then I saw the search button, typed in 'launch token', and found a link that mentioned 'launch' in the results. The search feature was helpful in finding the information.",
                        "issues_encountered": [
                            "Initially clicked on an unrelated link before using the search function."
                        ],
                        "path_taken": "Navigated to https://docs.base.org -> Clicked 'Manage Settings' (cookies) -> Clicked an unrelated link ('/use-cases/onboard-any-user') -> Clicked 'Search' -> Typed 'launch token' -> Clicked a search result ('/identity/basenames/basenames-faq#...') -> Scrolled down",
                        "score_of_usability": 8,
                        "time_taken": "120.0 seconds"
                    }
                ],
                "profile": "Normal person"
            }
        }
    ],
    "status": "success"
}