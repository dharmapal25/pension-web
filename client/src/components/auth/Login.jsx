import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleGoogleLogin = async () => {
    setPending(true); setError("");
    try {
      await loginWithGoogle();
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
    } finally { setPending(false); }
  };

  return <main className="auth-page"><h1>Welcome</h1><button onClick={handleGoogleLogin} disabled={pending}>{pending ? "Signing in..." : "Continue with Google"}</button>{error && <p>{error}</p>}</main>;
};

export default Login;
