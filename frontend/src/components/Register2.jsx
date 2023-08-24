import axios from 'axios';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

const Register2 = ({ setStep, values, verifiedEmail, setVerifiedEmail }) => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [count, setCount] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [resendIsLoading, setResendIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(true);

    useEffect(() => {
        let timeout;
        if(count > 0) {
            timeout = setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [count]);

    if(input1.length >= 4 ) {
        setInput1(input1[0]);
        setInput2(input1[1]);
        setInput3(input1[2]);
        setInput4(input1[3]);
    } else {
        if(input1.length > 1) {
            setInput1(input1[input1.length -1]);
        }
    }

    if(input2.length > 1) {
        setInput2(input2[input2.length -1]);
    }

    if(input3.length > 1) {
        setInput3(input3[input3.length -1]);
    }

    if(input4.length > 1) {
        setInput4(input4[input4.length -1]);
    }
    
    const handleChange = (e) => {
        if(e.target.value) {
            e.target.nextSibling?.focus();
        } else {
            e.target.previousSibling?.focus();
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        await axios.post('/api/auth/verify-email', {email: values.email, otp: input1 + input2 + input3 + input4})
            .then(res => {
                if(res.data.isCorrect) {
                    setVerifiedEmail([...verifiedEmail, values.email]);
                    setStep(3);
                } else {
                    setIsCorrect(res.data.isCorrect);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }

    const resendCode = async () => {
        setResendIsLoading(true);

        await axios.post('/api/auth/verify-email/generate', {email: values.email, username: values.username})
            .then(() => setCount(30))
            .catch(err => console.error(err))
            .finally(() => setResendIsLoading(false));
    }

    return (
        <div className='text-center'>
            <i className="fa-solid fa-envelope-open-text my-5" style={{fontSize: '100px'}}></i>

            <h6 className="text-center mb-5">We've sent the OTP code to <b>{values.email}</b>. Please verify your email. Expire in {count} second</h6>
            <form onSubmit={handleSubmit}>
                <div className="col d-flex justify-content-center gap-3 mb-4">
                    <input type="number" className='otp input-theme' value={input1} onChange={(e) => {
                            setInput1(e.target.value)
                            handleChange(e)
                        }} />
                    <input type="number" className='otp input-theme' value={input2} onChange={(e) => {
                            setInput2(e.target.value)
                            handleChange(e)
                        }} />
                    <input type="number" className='otp input-theme' value={input3} onChange={(e) => {
                            setInput3(e.target.value)
                            handleChange(e)
                        }} />
                    <input type="number" className='otp input-theme' value={input4} onChange={(e) => {
                            setInput4(e.target.value)
                            handleChange(e)
                        }} />
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <span className='text-danger'>{!isCorrect && 'OTP Code Wrong!'}</span>
                    {!resendIsLoading ?
                    <button type='button' className={`rounded-pill user-select-none py-1 px-2 ${count > 0 ? 'text-secondary' : 'text-primary'}`} onClick={resendCode} disabled={count > 0 && true}>Resend Code</button> :
                    <div role='button' className='user-select-none p-2' disabled>
                        <span className='d-inline-block me-2'>
                            <ClipLoader color='blue' size={18} />
                        </span>
                        <span className='text-primary d-inline-block'>Resending...</span>
                    </div>}
                </div>
                {!isLoading ? <button type="submit" className='btn btn-primary w-100'>Verify</button> :
                <button type="submit" className='btn btn-primary w-100' disabled>Verifying...</button>}
            </form>
        </div>
    )
}

export default Register2;