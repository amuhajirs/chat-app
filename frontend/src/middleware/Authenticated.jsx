import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";

export default function Authenticated({type}) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);

    useEffect(()=>{
        async function check(){
            await axios.get('/api/auth/loggedIn')
                .then(res=>{
                    if(!res.data.login){
                        setAuth(false);
                        if(type==='auth'){
                            return navigate('/login');
                        }
                    } else{
                        setAuth(res.data.login);
                        if(type==='guest'){
                            return navigate('/');
                        }
                    }
                })
                .catch(err=>{
                    console.log(err.response);
                    setAuth(false);
                    return navigate('/login');
                });
        }

        check();
    }, [navigate, type])
    return (
        <>
        {type==='auth' ? (auth && <Outlet context={auth} />) : (!auth && <Outlet />)}
        </>
    )
}