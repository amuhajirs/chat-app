import axios from "axios";
import { useState } from "react"
import { Link } from "react-router-dom";

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();

        setIsLoading(true);
        await axios.post('/api/auth/forgot', {email})
            .then(res=>console.log(res.data))
            .catch(err=>console.error(err.response))
            .finally(()=>setIsLoading(false));
    }

    return (
        <div className="container" style={{height: '100vh'}}>
            <Link to='/login' className="cool-btn bg-theme-primary" style={{position: 'absolute', top: '40px'}}>
                <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-4">
                        <div className="col">
                            <h1 className="text-center fw-bold">Forgot Password</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={handleSubmit} className="mb-3">
                                <div className="mb-3">
                                    <p className="text-center">Enter your email and we will send you a link via email to reset your password. <b>Dont</b> share it with anyone else.</p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="text" className="form-control fw-bold" id="email" placeholder="example@example.com" onChange={(e)=>setEmail(e.target.value)} />
                                </div>
                                {!isLoading ? (
                                <button type="submit" className="btn btn-primary w-100">Send Link</button>) : (
                                <button type="submit" className="btn btn-primary w-100" disabled>Sending...</button>
                                )}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Forgot