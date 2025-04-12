import React, { useState } from "react";
import logo from "../logo.svg";

const LoginPage = () => {
  const [website, setWebsite] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    website: "",
    prompt: ""
  });

  const validateForm = () => {
    const newErrors = {
      website: "",
      prompt: ""
    };

    if (!website) {
      newErrors.website = "Website URL is required";
    } else if (!/^https?:\/\/.+\..+/.test(website)) {
      newErrors.website = "Please enter a valid URL starting with http:// or https://";
    }

    if (!prompt && tasks.length === 0) {
      newErrors.prompt = "Please enter at least one task prompt";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      // Handle successful submission
    }
  };

  const handlePromptSubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        setTasks(prev => [...prev, prompt]);
        setPrompt("");
      }
    }
  };

  const removeTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-[#ffb715]/20 via-[#ffb715]/40 to-[#ffb715]/60">
      {/* Logo */}
      <div className="fixed top-4 left-4">
        <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl p-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <input
                  type="text"
                  id="website"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    setErrors(prev => ({ ...prev, website: "" }));
                  }}
                  className={`w-full px-3 py-1.5 bg-white/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com"
                  aria-invalid={!!errors.website}
                  aria-describedby={errors.website ? "website-error" : undefined}
                />
                {errors.website && (
                  <p id="website-error" className="text-xs text-red-600" role="alert">
                    {errors.website}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Task Prompts
                </label>
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-white/40 border border-gray-300 rounded-lg">
                      <p className="flex-1 text-gray-700">{task}</p>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      setErrors(prev => ({ ...prev, prompt: "" }));
                    }}
                    onKeyDown={handlePromptSubmit}
                    className={`w-full px-3 py-1.5 bg-white/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none ${
                      errors.prompt ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Type a task prompt and press Enter to add it..."
                    aria-invalid={!!errors.prompt}
                    aria-describedby={errors.prompt ? "prompt-error" : undefined}
                  />
                </div>
                {errors.prompt && (
                  <p id="prompt-error" className="text-xs text-red-600" role="alert">
                    {errors.prompt}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm ${
                  isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Start Testing"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 