import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "./AdminLogin.scss";
import axios from "axios";
import { render } from "../../host";

const AdminLogin = () => {
  const [userData, setUserData] = useState({
    password: "",
    email: "",
  });

  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const handleValidation = () => {
    const { email, password } = userData;
    if (email === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    if (handleValidation()) {
      try {
        const host = `${render}/api/auth/admin/login`;

        const response = await axios.post(host, {
          email,
          password,
        });

        const { data } = response;
        console.log("Login response:", data);

        if (data.status) {
          // Store admin details in localStorage
          const adminDetails = data.adminDetails || data; // Handle both response formats
          localStorage.setItem("adminDetails", JSON.stringify(adminDetails));
          
          // Store token in both cookie and localStorage
          Cookie.set("adminJwtToken", data.jwtToken, { expires: 9, path: "/", sameSite: "Lax" });
          localStorage.setItem("adminJwtToken", data.jwtToken);
          
          // Clear form
          setUserData({
            password: "",
            email: "",
          });
          
          // Show success message and redirect
          toast.success("Login successful!", toastOptions);
          
          // Force a full page reload to ensure all context is properly initialized
          window.location.href = "/admin";
        } else {
          toast.error(data.msg, toastOptions);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please try again.", toastOptions);
      }
    }
  };

  const onShowPass = () => {
    setShowPass((prev) => !prev);
  };

  return (
    <div className="adminLoginContainer">
      <form onSubmit={handleSubmit} className="formContainer">
        <h1>
          <span>i</span>Movies
        </h1>
        <p className="loginTitle">Admin Login</p>
        <div className="inputContainer">
          <label htmlFor="email" className="name">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            className="input"
            value={userData.email}
            onChange={onChange}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="pass" className="name">
            Password
          </label>
          <input
            name="password"
            id="pass"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            className="input"
            value={userData.password}
            onChange={onChange}
          />
        </div>
        <div className="checkbox">
          <input
            value={showPass}
            onChange={onShowPass}
            id="check"
            type="checkbox"
          />
          <label htmlFor="check">Show Password</label>
        </div>
        <button type="submit">Submit</button>
        <p>
          Create an account
          <Link style={{ textDecoration: "none" }} to={"/admin/register"}>
            <span>Register</span>
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
