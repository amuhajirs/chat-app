import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [emailUsername, setEmailUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const data = {emailUsername, password};

        await axios.post('/api/auth/login', data)
            .then(res=>{
                console.log(res.data);
                navigate('/');
            })
            .catch(err=>console.error(err.response));
    }

    return (
        <div className="container" style={{height: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-3">
                        <div className="col">
                            <h1 className="text-center fw-bold">Login</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="emailUsername" className="form-label">Email or Username</label>
                                    <input type="text" className="form-control fw-bold" id="emailUsername" placeholder="example@example.com" onChange={(e)=>setEmailUsername(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control fw-bold" id="password" placeholder="********" onChange={(e)=>setPassword(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <span>Dont have an account? <Link to="/register">Register here</Link></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;