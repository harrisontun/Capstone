/*ICON Link: https://react-icons.github.io/react-icons/icons?name=fa*/
import React, {useState} from "react";
import * as FaIcons from "react-icons/fa";
import {IoSettingsSharp} from "react-icons/io5";
import {IconContext} from "react-icons";
import {Link} from "react-router-dom";
import {Sidebar} from "./SidebarData";
import "../styles.css";

function Navbar() {
    //Close and Open Side Menu
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    var name = window.sessionStorage.getItem("f_name") + " " + window.sessionStorage.getItem("l_name");
    var user = window.sessionStorage.getItem("username");

    const signout= ()  => {
        sessionStorage.clear();
        window.location.href = '/'
    };

    return (
        <>
            <IconContext.Provider value={{ color: "undefined" }}>
                {/*Top of Page*/}
                {/*Left side menu bars*/}
                <div className="navbar-container">
                    <Link to="#" className="menu-bars">
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>

                    {/*Center Driver Incentive Program*/}
                    <div className="logo">
                        <Link to="/dashboard" className="header-logo">
                            Driver Incentive Program <FaIcons.FaTruck />
                        </Link>
                    </div>

                    {/*Right Side Header*/}
                    <div className="headerRight">
                        {/*Right Search*/} 
                        <div className="search">
                            <FaIcons.FaSearch />
                        </div>

                        {/*Right Settings*/}
                        <div className="settingsIcon">
                            <Link to="/settings" className="header-settings">
                                <IoSettingsSharp />
                            </Link>
                        </div>
                    </div>

                </div>

                {/*Determines if nav-menu is active or not*/}
                <nav className={sidebar ? "nav-menu active" : "nav-menu"}>

                    <ul className="nav-menu-items" onclick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars">
                                <FaIcons.FaArrowLeft onClick={showSidebar}/>
                            </Link>
                        </li>

                        <div className="nav-profile">
                            <Link to="/profile" className="nav-profile">
                                <FaIcons.FaRegUserCircle /> 
                                <span className="username">{name}</span>
                            </Link>
                            <br></br>
                            <span className="email">{user}</span>
                        </div>

                        {/*
                        Building block for elements of the side bar menu.
                        Gets information from SidebarData.js
                        */}
                        {Sidebar.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span className="side-bar-title">{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}

                                <li className="signout-text">
                                    <Link to="/">
                                        <FaIcons.FaSignOutAlt />
                                        <span onClick={signout} className="side-bar-title">Sign Out</span>
                                    </Link>
                                </li>
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;