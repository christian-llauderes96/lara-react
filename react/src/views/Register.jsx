import { useState, useRef } from "react";
import {Link} from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextsProvider";

export default function Register(){
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const [error, setError] = useState("");

    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        // debugger;
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const passwordConfirmation = passwordConfirmationRef.current.value;
        // Basic validation
        if (!fname || !email || !password || !passwordConfirmation) {
            setError("All fields are required.");
            return;
        }
        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        const payload = {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        };
        // console.log(payload);
        setError(""); // Clear error on successful validation
        //submission
        axiosClient.post("/register", payload)
        .then(({data})=>{
            setUser(data.user);
            setToken(data.token);
        })
        .catch(err=>{
            const response = err.response;
            if(response && response.status === 422){
                // console.log(response.data.errors);
                setError(response.data.errors);
            }
        });
    };

    return (
       <div className="container container vh-100 d-flex align-items-center justify-content-center fade-in-transition">
            <div className="p-5 bg-light border shadow rounded">
                <form onSubmit={onSubmit}>
                    <h1 className="text-center">Register for free</h1>

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
                        <label htmlFor="fname" className="form-label">Full name</label>
                        <input ref={nameRef} type="text" className="form-control" id="fname" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input ref={emailRef} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input ref={passwordRef} type="password" className="form-control" id="password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password2" className="form-label">Confirm Password</label>
                        <input ref={passwordConfirmationRef} type="password" className="form-control" id="password2" />
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Submit</button>
                    <div className="fs-6 text-center">
                        <i>Already Registered?&nbsp;</i><Link to="/login" className="text-decoration-none">Sign in</Link>
                    </div>

                </form>
            </div>
       </div>
    )
}