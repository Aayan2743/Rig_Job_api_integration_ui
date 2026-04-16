// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function AuthSuccess() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");


//     const parsed = JSON.parse(decodeURIComponent(data));

// login(parsed.token, parsed.user);

// navigate("/candidate/dashboard", { replace: true });

//     if (token) {

//         console.log("Received token:", token);
//       // 🔥 Save token
//       login(token, { role: "candidate" });

//       navigate("/candidate/dashboard");
//     } else {
//       navigate("/candidate/login");
//     }
//   }, []);

//   return <div className="p-10 text-center">Logging you in...</div>;
// }




import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data"); // ✅ correct

    if (!data) {
      navigate("/candidate/login");
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(data));

      console.log("Parsed Google Data:", parsed); // 🔥 debug

      // ✅ login with full user
      login(parsed.token, parsed.user);

      navigate("/candidate/dashboard", { replace: true });

    } catch (err) {
      console.error("Parse error:", err);
      navigate("/candidate/login");
    }
  }, []);

  return <div className="p-10 text-center">Logging you in...</div>;
}


// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function AuthSuccess() {
//   const navigate = useNavigate();
//   const { login } = useAuth();




// useEffect(() => {
//   const params = new URLSearchParams(window.location.search);
//   const data = params.get("data");

//   if (!data) {
//     navigate("/candidate/login");
//     return;
//   }

//   try {
//     const parsed = JSON.parse(decodeURIComponent(data));

//     // 🔥 Save first
//     localStorage.setItem("token", parsed.token);
//     localStorage.setItem("user", JSON.stringify(parsed.user));

//     // 🔥 reload app so auth is ready
//     window.location.replace("/candidate/dashboard");

//   } catch (err) {
//     console.error("Parse error:", err);
//     navigate("/candidate/login");
//   }
// }, []);

//   return (
//     <div className="h-screen flex items-center justify-center">
//       <p className="text-lg font-semibold">Logging you in...</p>
//     </div>
//   );
// }