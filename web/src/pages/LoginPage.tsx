import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await api.login(email, password);
      // later: store token
      console.log("login result", result);
      navigate("/exercises");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "3rem" }}>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: 360
        }}
      >
        <label>
          <div style={{ fontSize: "0.85rem" }}>Email</div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid #374151" }}
          />
        </label>
        <label>
          <div style={{ fontSize: "0.85rem" }}>Password</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid #374151" }}
          />
        </label>
        {error && (
          <div style={{ color: "#fca5a5", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 0.75rem",
            borderRadius: 999,
            border: "none",
            background: "#22c55e",
            color: "#020617",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
