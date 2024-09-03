import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "./views/NotFound";
import Login from "./views/Login";
import Register from "./views/Register";
import Users from "./views/Users";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import UserForm from "./views/UserForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            // Add your routes here
            {
                path: "/",
                element: <Navigate to="/Users" />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/users/new",
                element: <UserForm key="userCreate"/>
            },
            // since we are using same view we put key for identification 
            {
                path: "/users/:id",
                element: <UserForm key="userUpdate"/>
            },
        ]
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            // Add your routes here
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
        ]
    },
    {
        path: "/*",
        element: <NotFound />
    }
])

export default router;