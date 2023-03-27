import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if (confirmPassword===password){
            const data = {email, username, password};

            await axios.post('/api/auth/register', data)
                .then(res=>{
                    console.log(res.data);
                    navigate('/login');
                })
                .catch(err=>console.error(err.response));
        } else{
            alert('Confirm Password Wrong');
        }
    }
    return (
        <div className="container d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <div className="row justify-content-center">
                <div className="col-md-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-3">
                        <div className="col">
                            <h1 className="text-center fw-bold">Register</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-7 my-auto">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="email" onChange={(e)=>setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" className="form-control" id="username" onChange={(e)=>setUsername(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" onChange={(e)=>setPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" id="confirm_password" onChange={(e)=>setConfirmPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <span>Already have an account? <Link to="/login">Login now</Link></span>
                        </div>
                        <div className="col-5 d-flex align-items-center justify-content-center">
                            <img src="/logo512.png" alt="" width='100%' className="img-fluid" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register;