import React from "react";
import * as FaIcons from "react-icons/fa";
var user_type = sessionStorage.getItem("user_type");


export const Sidebar = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FaIcons.FaChalkboard />,
        cName: "nav-text",
    },
    {
        title: "Catalog",
        path: "/catalog",
        icon: <FaIcons.FaStore />,
        cName: "nav-text",
    },
    {
        title: "About",
        path: "/about",
        icon: <FaIcons.FaUsers />,
        cName: "nav-text",
    },
    (user_type!='D' &&
    {
        title: "User Management",
        path: "/userMgmt",
        icon: <FaIcons.FaUsersCog />,
        cName: "nav-text"
    }
    )
];