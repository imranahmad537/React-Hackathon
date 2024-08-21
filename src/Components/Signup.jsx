import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase";
import { setDoc, doc  } from "firebase/firestore";
import {toast} from "react-toastify"

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");

  const navigate = useNavigate('');
  const handleSignup = async (e) => {
    e.preventDefault();
    // Signup Login
    try {
      // authentication
     await createUserWithEmailAndPassword(auth,email,password);
     const user = auth.currentUser;
     console.log(user);
    // navigate("/signin")
     
     // store data in firestore
     if(user) // if user exist
     {
      await setDoc(doc(database, "User1", user.uid),{
        email : user.email,
        std_name : name,
      })
     }
     console.log("user registered Successfully");
     toast.success("User Registered Successfulyy",{
      position: "top-center"
     
     })
     navigate('/signin')
    } catch (error) {
      console.log(error.message);
      toast.error(error.message,{
        position: "top-center"
       })
    }
   
  };
  return (
    <div className="scontainer">
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="nameInp"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="emailInp"
          required
        />
        <input
          type="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="passInp"
           required
        />
        {/* <input
          type="Password"
          placeholder="Confirm Password"
          value={confirmpass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="cpassInp"
          // required
        /> */}
        <button className="btn" type="submit">Signup</button>
      </form>
      <span>
        Already have accout <Link to="/signin">Signin</Link> here
      </span>
    </div>
  );
};

export default Signup