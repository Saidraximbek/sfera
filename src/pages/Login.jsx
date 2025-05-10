import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useGlobalContext } from "../hooks/useGlobalContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useGlobalContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true); // Ulanish jarayonini boshlash

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      dispatch({ type: "LOGIN", payload: res.user });

      navigate("/home");
    } catch (err) {
      setError("Login failed: " + err.message);
    } finally {
      setIsPending(false); // Ulanish tugagach, isPendingni false qilish
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-[500px] p-20 bg-white rounded-2xl shadow-md">
        <div className="flex items-center self-center w-full text-3xl font-bold">
          <svg
            version="1.0"
            style={{ width: "150px", height: "150px" }}
            xmlns="http://www.w3.org/2000/svg"
            width="613.000000pt"
            height="324.000000pt"
            viewBox="0 0 613.000000 324.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,324.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M2895 3029 c-192 -12 -363 -58 -550 -149 -391 -189 -681 -542 -790
                -960 -31 -120 -67 -382 -54 -394 4 -3 25 0 269 43 63 11 194 34 290 50 205 35
                930 161 1510 261 91 16 323 56 515 89 902 156 1598 279 1580 280 -11 1 -108
                -6 -215 -14 -107 -8 -481 -35 -830 -60 -349 -25 -720 -52 -824 -60 -283 -22
                -283 -22 169 71 182 37 333 70 337 74 10 8 -88 154 -166 249 -116 141 -307
                287 -488 374 -239 115 -483 163 -753 146z"
              />
              <path
                d="M4345 1725 c-38 -7 -216 -38 -395 -69 -353 -61 -669 -115 -850 -147
                -63 -11 -414 -71 -780 -134 -366 -63 -714 -124 -775 -135 -60 -11 -202 -35
                -315 -55 -113 -19 -335 -57 -495 -85 -159 -27 -334 -58 -388 -67 -53 -9 -96
                -17 -94 -19 1 -1 182 11 402 27 1258 91 1661 119 1675 117 8 -2 -37 -14 -100
                -27 -63 -13 -162 -33 -220 -46 -58 -12 -166 -35 -241 -51 l-137 -28 49 -79
                c208 -336 553 -574 959 -665 100 -22 139 -26 300 -26 155 -1 203 3 292 22 673
                141 1163 702 1205 1379 5 85 4 103 -8 102 -8 0 -45 -7 -84 -14z"
              />
            </g>
          </svg>
          <h2>Sfera Learning Center</h2>
        </div>

       
        <form onSubmit={handleSubmit} className="space-y-4 text-xl">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="📩 Emailingizni kiriting..."
              required
              className="w-full h-15 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="🔑 Parol..."
              required
              className="w-full h-15 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isPending && (
            <button
              type="submit"
              className="w-full bg-gray-500 text-white py-2 rounded-lg  transition duration-200 disabled:opacity-30 h-15"
            >
              Ulanmoqda...
            </button>
          )}
          {!isPending && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 h-15"
            >
              Kirish
            </button>
          )}
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
