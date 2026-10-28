import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  MdMovieCreation,
  MdMovieEdit,
  MdOutlineDarkMode,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSunny, IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi2";
import { FaMasksTheater } from "react-icons/fa6";
import { LuHistory } from "react-icons/lu";
import Cookies from "js-cookie";
import { ThemeContext } from "../../context/themeContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome sign-out icon

const Header = () => {
  const [menu, setMenu] = useState(false);
  const { toggle, theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = Cookies.get("adminJwtToken");
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    // Remove admin JWT token with different path options
    Cookies.remove("adminJwtToken");
    Cookies.remove("adminJwtToken", { path: "/" });
    Cookies.remove("adminJwtToken", {
      path: "",
      domain: window.location.hostname,
    });

    // Clear all cookies that might contain admin data
    Cookies.remove("jwtToken");
    Cookies.remove("jwtToken", { path: "/" });

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Force page reload to clear any cached data
    window.location.href = "/admin/login";
  };

  return (
    <nav className={`adminHeader`}>
      <h1 onClick={() => navigate("/admin")}>
        <span>i</span>Movies
      </h1>

      <button onClick={() => setMenu(!menu)} className="menuButton">
        <RxHamburgerMenu />
      </button>

      {menu && (
        <ul className="menu">
          <li>
            {theme === "dark" ? (
              <IoSunny onClick={toggle} />
            ) : (
              <MdOutlineDarkMode onClick={toggle} />
            )}
          </li>
          <li onClick={() => navigate("/admin")}>
            <HiOutlineHome />
          </li>
          <li onClick={() => navigate("/admin/addmovie")}>
            <MdMovieEdit />
          </li>
          <li onClick={() => navigate("/admin/addshow")}>
            <IoAddCircleOutline />
          </li>
          <li onClick={() => navigate("/admin/addtheatre")}>
            <FaMasksTheater />
          </li>
          <li onClick={() => navigate("/admin/allbookings")}>
            <LuHistory />
          </li>
          {/* Add Logout option in the menu with FontAwesomeIcon */}
          <li onClick={handleLogout}>
            <button className="logoutButton">
              <FontAwesomeIcon icon={faSignOutAlt} />{" "}
              {/* FontAwesome Sign-Out Icon */}
            </button>
          </li>
        </ul>
      )}

      <div className="searchIconsContainerAdmin">
        <ul className="menuItems">
          <li className="item">
            {theme === "dark" ? (
              <IoSunny onClick={toggle} />
            ) : (
              <MdOutlineDarkMode onClick={toggle} />
            )}
          </li>
          <li onClick={() => navigate("/admin")} className="item">
            <HiOutlineHome />
          </li>
          <li className="item" onClick={() => navigate("/admin/addmovie")}>
            <MdMovieEdit />
          </li>
          <li className="item" onClick={() => navigate("/admin/addshow")}>
            <IoAddCircleOutline />
          </li>
          <li className="item" onClick={() => navigate("/admin/addtheatre")}>
            <FaMasksTheater />
          </li>
          <li className="item" onClick={() => navigate("/admin/allbookings")}>
            <LuHistory />
          </li>
          {/* Add Logout icon in the menu as well */}
          <li className="item" onClick={handleLogout}>
            <button className="logoutButton">
              <FontAwesomeIcon icon={faSignOutAlt} />{" "}
              {/* FontAwesome Sign-Out Icon */}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
