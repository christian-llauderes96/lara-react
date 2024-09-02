import React, { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider.jsx";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }
    const onLogout = (ev)=>{
        ev.preventDefault();
        // axiosClient.post('/logout', null, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     }
        // })
        axiosClient.post("/logout")
        .then(() =>{
            setUser({});
            setToken(null);
        })
        // return <Navigate to="/logout" />;
    }
    useEffect(() => {
        axiosClient.get("/user")
        .then(({data}) =>{
            setUser(data);
        })
    },[]);


    useEffect(() => {
        // Load Bootstrap's JavaScript after component mounts
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);

        // Initialize Bootstrap dropdown
        script.onload = () => {
            const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
            dropdownElementList.map(function (dropdownToggleEl) {
                return new bootstrap.Dropdown(dropdownToggleEl);
            });
        };

        // Cleanup function to remove script when component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        // Initialize sidebar toggle functionality
        const sidebarCollapseButton = document.getElementById('sidebarCollapse');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        const handleSidebarCollapse = () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('shifted');
        };

        sidebarCollapseButton.addEventListener('click', handleSidebarCollapse);

        return () => {
            sidebarCollapseButton.removeEventListener('click', handleSidebarCollapse);
        };
    }, []);

    return (
        <div className="d-flex">
            <nav id="sidebar" className="sidebar d-flex flex-column p-3">
                <h2 className="text-white">Brand Name</h2>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/users" className="nav-link">Users</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={onLogout}>Logout</a>
                    </li>
                </ul>
            </nav>

            <div id="mainContent" className="flex-grow-1 main-content">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button className="btn btn-outline-secondary" id="sidebarCollapse">
                            ☰
                        </button>
                        <form className="d-flex flex-grow-1 ms-3">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        </form>
                        <div className="flex-shrink-0 dropdown ms-3">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                { user.name }
                            </button>
                            <ul className="dropdown-menu " aria-labelledby="userDropdown">
                                <li><a className="dropdown-item" href="#">Profile</a></li>
                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#" onClick={onLogout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container-fluid p-4">
                    <h1>Main Content</h1>
                    <p>Your content goes here...</p>
                    <Outlet /> {/* Render nested routes here */}
                </div>
            </div>
        </div>
    );
}
