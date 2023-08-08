import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const [registerOrLogin, setRegisterOrLogin] = useState("login");

  const navigate = useNavigate();

  const [registerInput, setRegisterInput] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  console.log(registerInput);

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [inputError, setInputError] = useState("");

  const handleErrors = (error) => {
    setInputError(error);
    setTimeout(() => {
      setInputError("");
    }, 3000);
  };

  const handleRegister = async (e) => {
    //do something to handle register
    e.preventDefault();
    //validate the register input
    //username must be at least 3 characters
    if (registerInput.username.length < 3) {
      handleErrors("Username must be at least 3 characters");
      return;
    }

    //email must be valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(registerInput.email)) {
      handleErrors("Email must be valid");
      return;
    }

    //password must be at least 6 characters
    if (registerInput.password.length < 6) {
      handleErrors("Password must be at least 6 characters");
      return;
    }

    //password must match
    if (registerInput.password !== registerInput.confirmPassword) {
      handleErrors("Password does not match");
      return;
    }

    const { username, email, password } = registerInput;
    try {
      //Create user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName: username,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
      });
    } catch (error) {
      handleErrors(error.message);
    }

    setRegisterInput({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    //navigate to the profile page
    navigate("/profile");
  };

  const handleLogin = async (e) => {
    //do something to handle login
    e.preventDefault();

    const { email, password } = loginInput;
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
        }
      );
      setLoginInput({
        email: "",
        password: "",
      });
      navigate("/");
    } catch (err) {
      handleErrors(err.message);
    }
  };

  const splitLabel = (label) => {
    return label.split("").map((char, index) => (
      <span style={{ transitionDelay: `${index * 50}ms` }} key={index}>
        {char === "&" ? "\u00a0" : char}
      </span>
    ));
  };

  return (
    <div className={`auth-page ${registerOrLogin}`}>
      <div className="login-container">
        <div className="login-wrapper box">
          <h2>Alreday have an account?</h2>
          <button
            className="loginBtn"
            onClick={() => setRegisterOrLogin("login")}
          >
            Login
          </button>
        </div>
        <div className="register-wrapper box">
          <h2>Don't have an account?</h2>
          <button
            className="registerBtn"
            onClick={() => setRegisterOrLogin("register")}
          >
            Register
          </button>
        </div>
        <div className="form-box">
          {registerOrLogin === "login" ? (
            <form className="login-form form" onSubmit={handleLogin} autoComplete="on">
              <h2>Login Account</h2>
              <div className="inputBox">
                <input
                  type="text"
                  name="email"
                  value={loginInput.email}
                  required
                  onChange={(e) =>
                    setLoginInput({ ...loginInput, email: e.target.value })
                  }
                />
                <label>{splitLabel("Email")}</label>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  required
                  onChange={(e) =>
                    setLoginInput({ ...loginInput, password: e.target.value })
                  }
                />
                <label>{splitLabel("Input&Password")}</label>
              </div>
              <div className="inputBox">
                <input
                  type="submit"
                  className="submit-login submit"
                  value="LOGIN"
                />
              </div>
              <span className="inputError">{inputError}</span>
            </form>
          ) : (
            <form className="register-form form" onSubmit={handleRegister} autoComplete="on">
              <h2>New Account</h2>
              <div className="inputBox">
                <input
                  type="text"
                  name="email"
                  value={registerInput.email}
                  required
                  onChange={(e) =>
                    setRegisterInput({
                      ...registerInput,
                      email: e.target.value,
                    })
                  }
                />
                <label>{splitLabel("Email")}</label>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  name="username"
                  value={registerInput.username}
                  required
                  onChange={(e) =>
                    setRegisterInput({
                      ...registerInput,
                      username: e.target.value,
                    })
                  }
                />
                <label>{splitLabel("Username")}</label>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  value={registerInput.password}
                  required
                  onChange={(e) =>
                    setRegisterInput({
                      ...registerInput,
                      password: e.target.value,
                    })
                  }
                />
                <label>{splitLabel("Create&Password")}</label>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerInput.confirmPassword}
                  required
                  onChange={(e) =>
                    setRegisterInput({
                      ...registerInput,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <label>{splitLabel("Confirm&Password")}</label>
              </div>
              <div className="inputBox">
                <input
                  type="submit"
                  className="submit-register submit"
                  value="REGISTER"
                />
              </div>
              <span className="inputError">{inputError}</span>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
