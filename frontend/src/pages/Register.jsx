import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);

        if (confirmPassword===password){
            const data = {email, username, password};

            await axios.post('/api/auth/register', data)
                .then(res=>{
                    console.log(res.data);
                    navigate('/login');
                })
                .catch(err=>console.error(err.response))
                .finally(()=>setIsLoading(false));
        } else{
            alert('Confirm Password Wrong');
            setIsLoading(false);
        }
    }
    return (
        <div className="container" style={{height: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-3">
                        <div className="col">
                            <h1 className="text-center fw-bold mb-3">
                                <img src="/logo512.png" style={{width: '60px'}} alt="" /> ChatApp
                            </h1>
                            <h4 className="text-center">Create your account</h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="mb-4 field-theme">
                                    <input type="text" className="input-theme rounded-pill" id="email" onChange={(e)=>setEmail(e.target.value)} required />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="mb-4 field-theme">
                                    <input type="text" className="input-theme rounded-pill" id="username" onChange={(e)=>setUsername(e.target.value)} required />
                                    <label htmlFor="username">Username</label>
                                </div>
                                <div className="mb-4 field-theme">
                                    <input type="password" className="input-theme rounded-pill" id="password" onChange={(e)=>setPassword(e.target.value)} required />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="mb-4 field-theme">
                                    <input type="password" className="input-theme rounded-pill" id="confirm_password" onChange={(e)=>setConfirmPassword(e.target.value)} required />
                                    <label htmlFor="confirm_password">Confirm Password</label>
                                </div>
                                {!isLoading ? (<button type="submit" className="btn btn-primary w-100 rounded-pill">Register</button>) :
                                (<button type="submit" className="btn btn-primary w-100 rounded-pill" disabled>Registering...</button>)}
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