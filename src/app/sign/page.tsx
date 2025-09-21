"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      router.push("/mymove");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {

      if (!email || !password) {
        setMessage("Please fill in all fields");
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email && password) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", "user-123");

        setMessage("Sign in successful!");
        setTimeout(() => {
          router.push("/mymove");
        }, 1000);
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      setMessage("Sign in failed. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-20 bg-[#092C39]">
      <h1 className="font-[Montserrat] font-semibold text-[64px] leading-[80px] text-center mb-8 text-white">
        Sign in
      </h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg w-[300px] ${message.includes("successful")
            ? "bg-green-500/20 border border-green-500 text-green-300"
            : "bg-red-500/20 border border-red-500 text-red-300"
          }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-[300px] h-[45px] rounded-[10px] bg-[#224957] text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          style={{ opacity: 1 }}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-[300px] h-[45px] rounded-[10px] bg-[#224957] text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          style={{ opacity: 1 }}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2BD17E] text-white rounded-[10px] w-[300px] h-[54px] flex items-center justify-center gap-[5px] hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ opacity: 1, padding: "15px 125px" }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sign In.
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}
