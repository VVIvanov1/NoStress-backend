import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";

import "./defaultLoginArea.css";
import { FaTimes } from "react-icons/fa";

import LoginNavigation from "./LoginNavigation";

const DefaultLoginArea = () => {
  const { loggedIn, setLoggedIn, lang } = useGlobalContext();

  const [toggleReg, setToggleReg] = useState(true);

  useEffect(() => {
    console.log(loggedIn);
  }, []);

  const toggleRegister = (e) => {
    e.preventDefault();
    setToggleReg(false);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("LOGIN");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("REGISTER");
  };

  return (
    <div className="login-overlay">
      <div className="login-screen">
        <div className="login-form-header">
          {toggleReg ? (
            <h3>{lang === "En" ? "Login" : lang === "Kz" ? "Кіру" : "Вход"}</h3>
          ) : (
            <h3>
              {lang === "En"
                ? "Registration"
                : lang === "Kz"
                ? "Тіркеу"
                : "Регистрация"}
            </h3>
          )}
          {!toggleReg ? (
            <FaTimes
              className="close-login-btn"
              onClick={() => setToggleReg(true)}
            />
          ) : null}
        </div>

        <form className="login-form">
          {!toggleReg ? (
            <label htmlFor="name" className="login-input">
              Name:
              <input type="text" name="name" id="name"></input>
            </label>
          ) : null}

          <label htmlFor="email" className="login-input">
            Email:
            <input type="email" name="email" id="email"></input>
          </label>

          <label htmlFor="password" className="login-input">
            Password:
            <input type="password" name="password" id="password"></input>
          </label>

          {!toggleReg ? (
            <label htmlFor="password2" className="login-input">
              Confirm password:
              <input type="password" name="password2" id="password2"></input>
            </label>
          ) : null}

          <div className="login-form-buttons">
            {toggleReg ? (
              <>
                <button
                  className="register-btn"
                  onClick={(e) => toggleRegister(e)}
                >
                  Register
                </button>
                <button className="login-btn" onClick={(e) => handleLogin(e)}>
                  Login
                </button>
              </>
            ) : (
              <button
                className="register-btn-submit"
                onClick={(e) => handleRegister(e)}
              >
                Register
              </button>
            )}
          </div>
          {toggleReg ? (
            <p className="forgot-password-link">Forgot password?</p>
          ) : null}
        </form>
      </div>
      {/* <Router> */}
      {/* {loginScreen && (
          <LoginNavigation
            navButtons={loginScreen}
            setNavButtons={setLoginScreen}
          />
        )}

        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password-reset" element={<ResetPasswordPage />} />
        </Routes>
      </Router> */}
    </div>
  );
};

export default DefaultLoginArea;
