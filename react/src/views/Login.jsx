import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextsProvider";

export default function Login(){
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        // Basic validation
        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        const payload = {
            email,
            password
        };
        // console.log(payload);
        setError(""); // Clear error on successful validation
        //submission
        axiosClient.post("/login", payload)
        .then(({data})=>{
            setUser(data.user);
            setToken(data.token);
        })
        .catch(err=>{
            const response = err.response;
            if(response && response.status === 422){
                // console.log(response.data.errors);
                if(response.data.error){
                    setError(response.data.errors);
                }else{
                    setError({
                        email: [response.data.message]
                    });
                }
                
            }
        });
    };

    return (
       <div className="container container vh-100 d-flex align-items-center justify-content-center fade-in-transition">
            <div className="p-5 bg-light border shadow rounded">
                <form onSubmit={onSubmit}>
                    <h1 className="text-center">Login into your account</h1>
                    {/* Handle single error message */}
                    {error && typeof error === 'string' && <div className="alert alert-danger">{error}</div>}

                    {/* Handle multiple error messages */}
                    {error && typeof error === 'object' && 
                        <div className="alert alert-danger">
                            {Object.keys(error).map(key => (
                                <p key={key}>{error[key][0]}</p>
                            ))}
                        </div>
                    }
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input ref={emailRef} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input ref={passwordRef} type="password" className="form-control" id="exampleInputPassword1" />
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Submit</button>
                    <div className="fs-6 text-center">
                        <i>Not Registered?&nbsp;</i><Link to="/register" className="text-decoration-none">Create an account</Link>
                    </div>

                </form>
            </div>
       </div>
    )
}