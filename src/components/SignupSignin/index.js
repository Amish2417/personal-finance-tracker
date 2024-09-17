import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { auth, db } from "../../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {provider} from "../../Firebase"


function SignupSignin() {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setpassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [logInForm, setLogInForm] = useState(false);
  let navigate = useNavigate();

  function signup() {
    setLoading(true);
    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmPassword", confirmPassword);

    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("user>>", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setEmail("");
            setConfirmPassword("");
            setpassword("");
            creatDoc(user);
            navigate("/dashboard");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password and confirm Password don't match!!!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log("Email", email);
    console.log("password", password);
    setLoading(true);

    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("User Logged In", user);
          setLoading(false);
          navigate("/dashboard");

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function creatDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc Already Exist!!");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user",user);
        creatDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User Authenticated!!");
       
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        setLoading(false);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

    }catch(e){
      setLoading(false);
      toast.error(e.message);
      
    }
    
  }

  return (
    <>
      {logInForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>financely</span>
          </h2>
          <form>
            <Input
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="abc@gmail.com"
              type="email"
            />

            <Input
              label="Password"
              state={password}
              setState={setpassword}
              placeholder="Example@123"
              type="password"
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              disabled={loading}
              text={loading ? "Loading..." : "Login using Google"}
              blue={"true"}
            />
            <p className="p-login" onClick={() => setLogInForm(!logInForm)}>
              or Don't Have an Account ? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            sign up on <span style={{ color: "var(--theme)" }}>financely</span>
          </h2>
          <form>
            <Input
              label="Full Name"
              state={name}
              setState={setName}
              placeholder="Anish Kumar"
              type="text"
            />

            <Input
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="abc@gmail.com"
              type="email"
            />

            <Input
              label="Password"
              state={password}
              setState={setpassword}
              placeholder="Example@123"
              type="password"
            />

            <Input
              label="Confirm password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="Example@123"
              type="password"
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "sign up using Email and Password"}
              onClick={signup}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              disabled={loading}
              text={loading ? "Loading..." : "sign up using Google"}
              blue={"true"}
            />
            <p className="p-login" onClick={() => setLogInForm(!logInForm)}>
              or Have an Account Already ? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;
