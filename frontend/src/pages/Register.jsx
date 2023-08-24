import { useState } from "react";
import Register1 from "../components/Register1";
import Register2 from "../components/Register2";
import Register3 from "../components/Register3";

function Register() {
    const [step, setStep] = useState(1);
    const [step1Error, setStep1Error] = useState({});
    const [values, setValues] = useState({});
    const [verifiedEmail, setVerifiedEmail] = useState([]);

    return (
        <div className="container" style={{height: '100vh'}}>
            <div className="d-flex justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="bg-theme-primary rounded-2 p-4" style={{width: '480px'}}>

                    <div className="mb-3 position-relative">
                        {step > 1 && <span onClick={() => setStep(1)} className="cool-btn bg-theme-primary top-50" style={{position: 'absolute', translate: '0 -50%'}}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </span>}
                        <h1 className="text-center fw-bold mb-3">
                            <img src="/logo512.png" style={{width: '60px'}} alt="" /> ChatApp
                        </h1>
                    </div>

                    {step===1 ? (
                        <Register1 setStep={setStep} values={values} setValues={setValues} step1Error={step1Error} verifiedEmail={verifiedEmail} />
                    ) : step===2 ? (
                    <Register2 setStep={setStep} values={values} setStep1Error={setStep1Error} verifiedEmail={verifiedEmail} setVerifiedEmail={setVerifiedEmail} />
                    ) : step===3 && (
                    <Register3 setStep={setStep} values={values} setStep1Error={setStep1Error} />
                    )}

                </div>
            </div>
        </div>
    )
}

export default Register;