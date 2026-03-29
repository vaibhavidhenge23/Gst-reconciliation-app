"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { verifyAndFetchUser } from "./actions";

export default function LoginPage() {
  const [pan, setPan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Valid Indian PAN format: 5 letters, 4 numbers, 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!pan) {
      setError("PAN is required.");
      return;
    }

    if (!panRegex.test(pan.toUpperCase())) {
      setError("Invalid PAN format. Example: ABCDE1234F");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Authenticating directly with Prisma DB via NextJS Server Action
      const result = await verifyAndFetchUser(pan);
      
      if (result.success && result.user) {
        // Safe mock local session logic post DB verification
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userPAN", result.user.pan);
        localStorage.setItem("userId", result.user.id.toString());
        
        // Redirecting to root dashboard securely
        router.push("/");
      } else {
        setError(result.error || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      setError("A network or server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-md w-full backdrop-blur-md bg-white/90 dark:bg-gray-800/90 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-blue-900/5">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
            Secure Access
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-2">
            Verify your Permanent Account Number to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="pan" 
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              PAN Number
            </label>
            <div className="relative group">
              <input
                id="pan"
                type="text"
                value={pan}
                onChange={(e) => {
                  setPan(e.target.value.toUpperCase());
                  setError("");
                }}
                maxLength={10}
                className={`w-full px-5 py-4 rounded-2xl border-2 tracking-widest font-mono text-center text-lg \${
                  error 
                    ? "border-red-300 focus:border-red-500 bg-red-50 text-red-900" 
                    : "border-gray-200 dark:border-gray-600 focus:border-blue-500 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                } focus:outline-none transition-all uppercase placeholder-gray-400 dark:placeholder-gray-500 shadow-sm`}
                placeholder="ABCDE1234F"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="mt-3 flex items-center justify-center text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg px-3 text-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold py-4 px-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-500/30 flex justify-center items-center group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Verify Identity
                <svg className="w-5 h-5 ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
          Encrypted & Secure DB Verification
        </div>
      </div>
    </div>
  );
}
