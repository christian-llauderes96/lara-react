import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextsProvider";

export default function UserForm(){
    const {id} = useParams();
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {setNotification} = useStateContext("");
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        id: null
    });

    if(id){
        useEffect(()=>{
            setLoading(true);
            axiosClient.get( `/users/${id}`)
            .then(({data})=>{
                // console.log("API Response Data:", data);
                setUser(data.data);
                setLoading(false);
            })
            .catch(()=>{
                setLoading(false);
                console.log("Error fetching user");
            });
        },[]);
    }
    const onSubmit = (ev) => {
        ev.preventDefault();
        if(user.id){
            axiosClient.put(`/users/${id}`, user)
           .then(() => {
                setNotification("User updated successfully");
                Navigate("/users");
                setError(null);
           })
           .catch(err=>{
                const response = err.response;
                if(response && response.status === 422){
                    // console.log(response.data.errors);
                    setError(response.data.errors);
                }
            });
        }else{
            axiosClient.post(`/users/`, user)
            .then(() => {
                setNotification("User created successfully");
                Navigate("/users");
                setError(null);
            })
            .catch(err=>{
                 const response = err.response;
                 if(response && response.status === 422){
                    // console.log(response.data.errors);
                    setError(response.data.errors);
                 }
             });
        }
    }



    return (
        <>
        {user.id && <h1>Update User: {user.name}</h1>}
        {!user.id && <h1>New User</h1>}
       
        <div className="card shadow">
            <div className="card-body">
                {error && typeof error === 'object' && 
                    <div className="alert alert-danger">
                        {Object.keys(error).map(key => (
                            <p key={key}>{error[key][0]}</p>
                        ))}
                    </div>
                }
                {loading && <div className="text-center">Loading...</div>}
                {!loading && 
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fname" className="form-label">Full name</label>
                        <input value={user.name} onChange={ec => setUser({...user, name: ec.target.value})} type="text" className="form-control" id="fname" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input value={user.email} onChange={ec => setUser({...user, email: ec.target.value})} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input onChange={ec => setUser({...user, password: ec.target.value})} type="password" className="form-control" id="password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password2" className="form-label">Confirm Password</label>
                        <input onChange={ec => setUser({...user, password_confirmation: ec.target.value})} type="password" className="form-control" id="password2" />
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Submit</button>
                </form>}
            </div>
        </div>
        </>
    );
}