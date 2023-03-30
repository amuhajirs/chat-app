import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Custom404 from "./404";

const Reset = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isInvalid, setIsInvalid] = useState(true);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        const verify = async ()=>{
            await axios.post('/api/auth/verify', {token})
                .then(res=>{
                    setIsInvalid(false);
                    setEmail(res.data.email);
                })
                .catch(err=>{
                    setIsInvalid(true);
                    console.error(err.response);
                });
        }

        verify();
    });

    const handleSubmit = (e)=>{
        e.preventDefault();
        setIsLoading(true);

        if(newPassword===confirmPassword){
            axios.post('/api/auth/reset', {token, password: newPassword})
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
        <>
        {!isInvalid ? (<div className="container" style={{height: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-4">
                        <div className="col">
                            <h1 className="text-center fw-bold">Reset Password</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="mb-3">
                                    <p className="text-center">Enter your new password for <b>{email}</b></p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input type="password" className="form-control fw-bold" id="newPassword" placeholder="********" onChange={(e)=>setNewPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control fw-bold" id="confirmPassword" placeholder="********" onChange={(e)=>setConfirmPassword(e.target.value)} />
                                </div>
                                {!isLoading ? (
                                <button type="submit" className="btn btn-primary w-100">Reset Password</button>) : (
                                <button type="submit" className="btn btn-primary w-100" disabled>Resetting...</button>
                                )}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>) : (<Custom404 />)}
        </>
    )
}

export default Reset;