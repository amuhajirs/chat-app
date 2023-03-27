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
        <div className="container" style={{height: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-3">
                        <div className="col">
                            <h1 className="text-center fw-bold">Register</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control fw-bold" id="email" placeholder="example@example.com" onChange={(e)=>setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" className="form-control fw-bold" id="username" placeholder="example" onChange={(e)=>setUsername(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control fw-bold" id="password" placeholder="********" onChange={(e)=>setPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control fw-bold" id="confirm_password" placeholder="********" onChange={(e)=>setConfirmPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <span>Already have an account? <Link to="/login">Login now</Link></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register;