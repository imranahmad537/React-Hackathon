import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate('');

  const handleLogin = async (e) => {
    e.preventDefault(); 
    // Login Logic
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signin Successfully");
     
      navigate("/main");
      toast.success("User Registered Successfulyy",{
        position: "top-center"
       
       })
    } catch (error) {
      console.log(error.message);
      toast.error(error.message,{
        position: "top-center"
       })
    }
  };

  return (
    <>
    
    <div className="lcontainer">
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          // name="email"
          placeholder="Email or Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="emailInp"
          required
        />
        <input
          type="Password"
          // name="password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="passInp"
          required
        />
        <button className="btn" type="submit">Login</button>
      </form>

      <div>
        <span className="spn">
          Don't have an account <Link to="/signup">Sign up</Link> here
        </span>
      </div>
    </div>
    </>
    
  );
};
