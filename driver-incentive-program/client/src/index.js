import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Profile from "./routes/profile";
import Dashboard from "./routes/dashboard";
import Catalog from "./routes/catalog";
import About from "./routes/about";
import Signin from "./routes/signin";
import Settings from "./routes/settings";
import "./styles.css";
import Navbar from "./components/navbar";
import Application from "./routes/application";
import AddUser from "./routes/addUser";
import ViewApps from "./routes/viewApps";
import ExistingUserApp from "./routes/existingUserApp";
import AddToSponsor from "./routes/addToSponsor";
import PasswordReset from "./routes/passwordReset";
import EditProfile from "./routes/editProfile";
import UserMgmt from "./routes/userMgmt";
import DeleteUser from "./routes/deleteUser";
import RemoveUser from "./routes/removeUser";
import ChangeUser from "./routes/changeUser";
const Layout = () => (
    <>
    <Navbar />
    <Outlet />
    </>
);

//Array of different routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <Signin />,
    },
    {
        path: "/application",
        element: <Application />,
    },
    {
        path: "/passwordReset",
        element: <PasswordReset />,
    },
    {

        element: <Layout />,
        children: [
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/catalog",
                element: <Catalog />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/settings",
                element: <Settings />,
            },
            {
                path: "/viewApps",
                element: <ViewApps />
            },
            {
                path: "/addUser",
                element: <AddUser />
            },
            {
                path: "/existingUserApp",
                element: <ExistingUserApp />
            },
            {
                path: "addToSponsor",
                element: <AddToSponsor />
            },
            {
                path: "/editProfile",
                element: <EditProfile />
            },
                        {
                path: "/userMgmt",
                element: <UserMgmt />
            },
            {
                path: '/deleteUser',
                element: <DeleteUser />
            },
            {
                path: '/removeUser',
                element: <RemoveUser />
            },
            {
                path: 'changeUser',
                element: <ChangeUser />
            }

        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);