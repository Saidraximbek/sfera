import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useGlobalContext } from "../hooks/useGlobalContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [error, setError] = useState(null);

  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();  // useNavigate hook to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Firebase orqali tizimga kirish
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Kirish muvaffaqiyatli bo'lsa, foydalanuvchini contextga yuborish
      dispatch({ type: "LOGIN", payload: res.user });

      // Foydalanuvchini Home sahifasiga yo'naltirish
      navigate("/home");

    } catch (err) {
      setError("Login failed: " + err.message);  // Xatolikni ko'rsatish
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
