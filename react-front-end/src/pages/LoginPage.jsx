import React, { useState } from "react";
// Assuming logo is correctly imported relative to this file's location
// Using a placeholder if the import path isn't guaranteed
const logo = "./logo.svg"

const LoginPage = () => {
  // --- State Variables ---
  const [website, setWebsite] = useState(""); // website_link
  const [singleTask, setSingleTask] = useState(""); // State for the single task description (task)
  const [numAgents, setNumAgents] = useState(""); // num_agents
  const [currentProfile, setCurrentProfile] = useState(""); // Input field for adding new profiles
  const [profiles, setProfiles] = useState([]); // List of profiles (profiles)

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ // Initialize all relevant error keys
    website: "",
    task: "", // Error key for the single task field
    numAgents: "",
    profiles: ""
  });

  // --- Validation ---
  const validateForm = () => {
    const newErrors = { // Reset errors object
        website: "",
        task: "", // Use the new key for single task validation
        numAgents: "",
        profiles: ""
    };
    let isValid = true;

    // Validate Website URL
    if (!website) {
      newErrors.website = "Website URL is required";
      isValid = false;
    } else if (!/^https?:\/\/.+\..+/.test(website)) {
      newErrors.website = "Please enter a valid URL starting with http:// or https://";
      isValid = false;
    }

    // Validate Single Task (check if the string is empty)
    if (!singleTask.trim()) {
      newErrors.task = "Task description is required";
      isValid = false;
    }

    // Validate Number of Agents
    if (!numAgents) {
        newErrors.numAgents = "Number of agents is required.";
        isValid = false;
    } else {
        const num = parseInt(numAgents, 10);
        if (isNaN(num) || num < 1) {
            newErrors.numAgents = "Please enter a valid number (at least 1).";
            isValid = false;
        }
    }

    // Validate Profiles (list must not be empty)
    if (profiles.length === 0) {
      newErrors.profiles = "Please add at least one agent profile";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      // Prepare data payload with requested keys
      const submissionData = {
        website_link: website,
        task: singleTask.trim(), // Use the single task string directly
        num_agents: parseInt(numAgents, 10),
        profiles: profiles
      };

      console.log("Submitting Data:", submissionData);

      // Simulate API call
      try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log("Submission Successful!");
          // Optional: Clear form after successful submission
          // setWebsite(''); setSingleTask(''); setNumAgents(''); setCurrentProfile(''); setProfiles([]);
          // setErrors({ website: "", task: "", numAgents: "", profiles: "" });
      } catch (error) {
           console.error("Submission Failed:", error);
           // Handle API error
      } finally {
          setIsLoading(false);
      }

    } else {
        console.log("Validation Failed:", errors);
    }
  };

  // --- Profile Input Handlers (Keep these as profiles are still multi-input) ---
   const handleProfileSubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmedProfile = currentProfile.trim();
      if (trimmedProfile) {
        if (!profiles.includes(trimmedProfile)) {
            setProfiles(prev => [...prev, trimmedProfile]);
        }
        setCurrentProfile("");
        setErrors(prev => ({ ...prev, profiles: "" }));
      }
    }
  };

  const removeProfile = (index) => {
    setProfiles(prev => prev.filter((_, i) => i !== index));
     if (profiles.length - 1 > 0) {
        setErrors(prev => ({ ...prev, profiles: "" }));
    }
  };


  // --- JSX ---
  return (
    <div className="min-h-svh bg-gradient-to-br from-[#ffb715]/20 via-[#ffb715]/40 to-[#ffb715]/60">
      {/* Logo */}
      <div className="fixed top-4 left-4">
        <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
      </div>

      {/* Dashboard Button */}
      <div className="fixed top-4 right-4">
        <button
          onClick={() => alert("Dashboard clicked!")}
          className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/30 rounded-lg text-gray-700 hover:bg-white/80 transition-colors"
        >
          Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl p-6">
            <div className="space-y-4">

              {/* Website URL (website_link) */}
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

              {/* Single Task Description (task) */}
              <div className="space-y-1">
                <label htmlFor="singleTask" className="block text-sm font-medium text-gray-700">
                  Task Description
                </label>
                <textarea
                  id="singleTask"
                  value={singleTask}
                  onChange={(e) => {
                      setSingleTask(e.target.value);
                      // Clear the specific error when user types
                      setErrors(prev => ({ ...prev, task: "" }));
                  }}
                  className={`w-full px-3 py-1.5 bg-white/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] ${
                      errors.task ? "border-red-500" : "border-gray-300" // Check errors.task
                  }`}
                  placeholder="Describe the single task the agents should perform (e.g., Find the contact page and extract the email address)"
                  aria-invalid={!!errors.task} // Check errors.task
                  aria-describedby={errors.task ? "task-error" : undefined} // Link to task-error
                />
                {/* Error message specifically for the single task */}
                {errors.task && (
                  <p id="task-error" className="text-xs text-red-600" role="alert">
                      {errors.task}
                  </p>
                )}
              </div>


              {/* Number of Agents (num_agents) */}
               <div className="space-y-1">
                <label htmlFor="numAgents" className="block text-sm font-medium text-gray-700">
                  Number of Agents
                </label>
                <input
                  type="number"
                  id="numAgents"
                  value={numAgents}
                  onChange={(e) => {
                    setNumAgents(e.target.value);
                    setErrors(prev => ({ ...prev, numAgents: "" }));
                  }}
                   min="1"
                  className={`w-full px-3 py-1.5 bg-white/40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.numAgents ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 5"
                  aria-invalid={!!errors.numAgents}
                  aria-describedby={errors.numAgents ? "numAgents-error" : undefined}
                />
                {errors.numAgents && (
                  <p id="numAgents-error" className="text-xs text-red-600" role="alert">
                    {errors.numAgents}
                  </p>
                )}
              </div>

              {/* Agent Profiles (profiles) - Still multi-input */}
               <div className="space-y-1">
                <label htmlFor="profileInput" className="block text-sm font-medium text-gray-700">
                   Agent Profiles (Press Enter to add)
                </label>
                <div className="space-y-2">
                   <div className={`bg-white/40 border rounded-lg min-h-[100px] ${
                       errors.profiles ? "border-red-500" : "border-gray-300"
                    }`}>
                    <div className="flex flex-wrap gap-2 px-3 py-1.5">
                      {profiles.map((profile, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded group">
                          <span className="text-gray-700 text-sm">{profile}</span>
                          <button
                            type="button"
                            onClick={() => removeProfile(index)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            aria-label={`Remove profile: ${profile}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <textarea
                      id="profileInput"
                      value={currentProfile}
                      onChange={(e) => {
                        setCurrentProfile(e.target.value);
                        if (e.target.value.trim()) {
                           setErrors(prev => ({ ...prev, profiles: "" }));
                        }
                      }}
                      onKeyDown={handleProfileSubmit}
                      className="w-full px-3 py-1.5 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none"
                       placeholder={profiles.length === 0 ? "e.g., Tech-savvy early adopter..." : "Add another profile..."}
                       aria-invalid={!!errors.profiles}
                       aria-describedby={errors.profiles ? "profiles-error" : undefined}
                    />
                  </div>
                </div>
                {errors.profiles && (
                  <p id="profiles-error" className="text-xs text-red-600" role="alert">
                    {errors.profiles}
                  </p>
                )}
              </div>


              {/* Submit Button */}
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