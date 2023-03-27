import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const data = {email, password};

        await axios.post('/api/auth/login', data)
            .then(res=>{
                console.log(res.data);
                navigate('/');
            })
            .catch(err=>console.error(err.response));
    }

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <div className="row justify-content-center">
                <div className="col-md-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-3">
                        <div className="col">
                            <h1 className="text-center fw-bold">Login</h1>
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
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" onChange={(e)=>setPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <span>Dont have an account? <Link to="/register">Register here</Link></span>
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

export default Login;