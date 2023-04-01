import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import Loading from '../components/Loading';

export default function Authenticated({type}) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                })
                .finally(()=>{
                    setIsLoading(false);
                });
        }

        check();
    }, [navigate, type])
    return (
        <>{isLoading ? <Loading /> : type==='auth' ? (auth && <Outlet context={{auth}} />) : (!auth && <Outlet />)}</>
    )
}