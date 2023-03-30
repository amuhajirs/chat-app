import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Custom404() {
    const [count, setCount] = useState(5);

    const navigate = useNavigate();
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setCount(count-1)
        }, 1000);

        if (count===0){
            navigate('/');
        }

        return ()=>clearTimeout(timeout)
    }, [count, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div>
                <h1 className="text-center fw-bold">404</h1>
                <h1 className="text-center">PAGE NOT FOUND</h1>

                <span>You will automatically redirect to home in <b>{count}</b> seconds.</span>
            </div>
        </div>
    )
}

export default Custom404;