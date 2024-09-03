import { useEffect, useState } from "react"
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider";
import DataTable from 'react-data-table-component';
        

export default function Users(){

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const {setNotification} = useStateContext("");


    useEffect(() => {
        getUsers(currentPage, perPage);
    }, [currentPage, perPage]);

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

    const getUsers = (page = 1, perPage = 10) => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}&per_page=${perPage}`)
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
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Full Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: row => row.created_at,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="d-flex justify-content-center flex-nowrap gap-2">
                    <Link to={`/users/${row.id}`} className="btn btn-success">Edit</Link>
                    <button onClick={() => deleteUser(row.id)} className="btn btn-danger">Delete</button>
                </div>
            ),
        },
    ];

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
                    <DataTable
                        columns={columns}
                        data={users}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalPages * perPage}
                        onChangePage={page => setCurrentPage(page)}
                        paginationPerPage={perPage}
                        onChangeRowsPerPage={page => setPerPage(page)}
                        // paginationPerPageOptions={[10, 15, 20, 25, 30]} // Custom options here
                    />
                </div>
            </div>
        </div>
    );
}