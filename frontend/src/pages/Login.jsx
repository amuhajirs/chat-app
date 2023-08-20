import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import LoadingProgress from "../components/LoadingProgress";

const Login = () => {
    const { setUser, setFriends, setChats } = ChatState();
    const [emailUsername, setEmailUsername] = useState('');
    const [password, setPassword] = useState('');
    const [badCredentials, setBadCredentials] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsSubmitting(true);

        await axios.post('/api/auth/login', {emailUsername, password})
            .then(res => {
                setUser({login: res.data.login, data: res.data.data});
                fetchData();
            })
            .catch(()=>{
                setBadCredentials('Bad Credentials');
                setIsSubmitting(false);
            })
    }

    // Get user's chats and friends
    const fetchData = async () => {
        setIsLoading(true);

        await axios.get('/api/auth/data', {
            onDownloadProgress: (progressEvent) => {
                setProgress(progressEvent.progress);
            }
        })
        .then(res => {
            setChats(res.data.data?.chats || []);
            setFriends(res.data.data?.friends || []);
            setTimeout(() => {
                setIsLoading(false);
                navigate('/');
            }, 200);
        })
        .catch(err => console.error(err))
        .finally(() => setTimeout(() => {setIsLoading(false)}, 200) );
    }

    return (
        !isLoading ?
        <div className="container" style={{height: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-4">
                        <div className="col">
                            <h1 className="text-center fw-bold mb-3">
                                <img src="/logo512.png" style={{width: '60px'}} alt="" /> ChatApp
                            </h1>
                            <h4 className="text-center">{'Welcome Back :)'}</h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="pb-4 field-theme">
                                    <input type="text" className="input-theme rounded-pill" id="emailUsername" onChange={(e)=>setEmailUsername(e.target.value)} required autoComplete="off" />
                                    <label htmlFor="emailUsername">Email or Username</label>
                                </div>
                                <div className="pb-4 field-theme">
                                    <input type="password" className="input-theme rounded-pill" id="password" onChange={(e)=>setPassword(e.target.value)} required autoComplete="off" />
                                    <label htmlFor="password">Password</label>
                                    {badCredentials && <span className="error-message ms-3">{badCredentials}</span>}
                                </div>
                                <div className="mb-3">
                                    <Link to="/forgot">Forgot your password?</Link>
                                </div>

                                {!isSubmitting ? (<button type="submit" className="btn btn-primary w-100 rounded-pill">Log In</button>) :
                                (<button type="submit" className="btn btn-primary w-100 rounded-pill" disabled>Logging In...</button>)}
                            </form>
                            <span>Dont have an account? <Link to="/register">Register here</Link></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        : <LoadingProgress progress={progress} />
    )
}

export default Login;