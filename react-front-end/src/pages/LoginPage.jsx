import React from "react";
import logo from "../logo.svg";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#333333]">
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-2xl">
          <div className="flex justify-center md:justify-start mb-8">
            <a href="#" className="flex items-center gap-1.5 text-xl font-medium text-white">
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
              warp
            </a>
          </div>
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex items-center justify-center p-6 md:p-10">
        <div className="w-full h-full max-w-2xl rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden">
          <img
            src="/honeycomb.jpg"
            alt="Honeycomb texture"
            className="h-full w-full object-cover mix-blend-overlay opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 