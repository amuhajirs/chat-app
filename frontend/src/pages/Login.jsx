import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const Login = () => {
    const { setUser } = ChatState();
    const [emailUsername, setEmailUsername] = useState('');
    const [password, setPassword] = useState('');
    const [badCredentials, setBadCredentials] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);

        await axios.post('/api/auth/login', {emailUsername, password})
            .then(res => setUser({login: res.data.login, data: res.data.data}))
            .catch(() => setBadCredentials('Bad Credentials'))
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="container" style={{height: '100vh'}}>
            <div className="d-flex justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="bg-theme-primary rounded-2 p-4" style={{width: '480px'}}>

                    <div className="mb-4">
                        <h1 className="text-center fw-bold mb-3">
                            <img src="/logo512.png" style={{width: '60px'}} alt="" /> ChatApp
                        </h1>
                        <h4 className="text-center">{'Welcome Back :)'}</h4>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className="mb-3">
                            <div className="mb-3 field-theme">
                                <input type="text" className="input-theme rounded-2 w-100" id="emailUsername" onChange={(e)=>setEmailUsername(e.target.value)} required autoComplete="off" />
                                <label htmlFor="emailUsername">Email or Username</label>
                            </div>
                            <div className="mb-4 field-theme">
                                <input type="password" className="input-theme rounded-2 w-100" id="password" onChange={(e)=>setPassword(e.target.value)} required autoComplete="off" />
                                <label htmlFor="password">Password</label>
                                {badCredentials && <span className="error-message ms-3">{badCredentials}</span>}
                            </div>
                            <div className="mb-3">
                                <Link to="/forgot">Forgot your password?</Link>
                            </div>

                            {!isLoading ? (<button type="submit" className="btn btn-primary w-100 rounded-2">Log In</button>) :
                            (<button type="submit" className="btn btn-primary w-100 rounded-2" disabled>Logging In...</button>)}
                        </form>
                        <span>Dont have an account? <Link to="/register">Register here</Link></span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;