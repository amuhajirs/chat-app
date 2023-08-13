import axios from "axios";
import { useState, useRef } from "react"
import { Link } from "react-router-dom";

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const myModal = useRef();
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        setIsLoading(true);
        await axios.post('/api/auth/forgot', {email})
            .then((res)=>{
                console.log(res.data);
                const modal = new window.bootstrap.Modal(myModal.current);
                modal.show();
            })
            .catch(err=>console.error(err.response))
            .finally(()=>setIsLoading(false));
        setIsLoading(false);
    }

    return (
        <>
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
                                <div className="pb-4 field-theme">
                                    <input type="text" className="input-theme rounded-pill" id="email" onChange={(e)=>setEmail(e.target.value)} required />
                                    <label htmlFor="email">Email</label>
                                </div>
                                {!isLoading ? (
                                <button type="submit" className="btn btn-primary w-100 rounded-pill">Send Link</button>) : (
                                <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled>Sending...</button>
                                )}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* Modal */}
        <div className="modal fade" id="successModal" tabIndex="-1" aria-hidden="true" ref={myModal} data-bs-theme="dark">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-theme-primary">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Reset Link Sent</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <p>Link has been sent successfully to <b>{email}</b>. Check your email now.</p>
                        </div>
                        <div className=" d-flex justify-content-end align-items-center pt-3">
                            <a href="/login" type="button" className="btn btn-primary px-4">Okay</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Forgot;