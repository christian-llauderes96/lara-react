import { useEffect, useState } from "react"
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider";
        

export default function Users(){

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {setNotification} = useStateContext("");


    useEffect(() => {
        getUsers(currentPage);
    }, [currentPage]);

    const deleteUser = (u) => {
        if(!window.confirm('Are you sure you want to delete this user?')) return;

        axiosClient.delete(`/users/${u}`)
           .then(() => {
                setNotification("User deleted successfully");
                setUsers(users.filter(user => user.id!== u));
            })
           .catch(() => {
                console.log("Error deleting user");
            });
    }

    // const getUsers = (page)=>{
    //     setLoading(true);
    //     axiosClient.get("/users")
    //         .then(({data})=>{
    //             setLoading(false);
    //             setUsers(data.data);
    //         })
    //         .catch(() => {
    //             setLoading(false);
    //             console.log("Error fetching users");
    //         });
    // }
    const getUsers = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setCurrentPage(data.meta.current_page);
                setTotalPages(data.meta.last_page);
            })
            .catch(() => {
                setLoading(false);
                console.log("Error fetching users");
            });
    }

    return (
        <div>
            <div className="mb-4">
                <div className="d-flex justify-content-between">
                    <h1>Users</h1>
                    <Link to="/users/new" className="btn btn-primary">Add new</Link>
                </div>
                
            </div>
            <div className="card shadow">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fullame</th>
                                <th>Email</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && <tr><td colSpan="5" className="text-center">Loading...</td></tr>}
                            {users.length === 0 &&!loading && <tr><td colSpan="5" className="text-center">No users found</td></tr>}
                        </tbody>
                        {!loading && <tbody>
                            {users.map(u =>(
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <div className="d-flex justify-content-center flex-nowrap gap-2">
                                        <Link to={"/users/"+u.id} className="btn btn-success">Edit</Link>
                                        <button onClick={(ev)=>deleteUser(u.id)} className="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>}
                    </table>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button className="btn btn-primary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}