import { useState } from "react";
import AdminPanel from "./AdminPanel";

export default function AdminGate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ✅ Custom credentials check
    if (username === "togetherbed" && password === "123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };
  console.log("Entered username:", username);
console.log("Entered password:", password);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 border border-gray-300 bg-[rgba(217,217,217,0.37)] px-3 py-2 rounded focus:outline-none focus:border-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
              className="w-full mb-4 border border-gray-300 bg-[rgba(217,217,217,0.37)] px-3 py-2 rounded focus:outline-none focus:border-black"
            value={password}
            
            onChange={(e) => setPassword(e.target.value)}
          />
         
         <div className="flex justify-center">
  <button
    className="bg-black text-white px-12 py-2 rounded"
    onClick={handleLogin}
  >
    Login
  </button>
</div>
        </div>
      </div>
    );
  }

  // ✅ Show Admin Panel once authenticated
  return <AdminPanel />;
}
