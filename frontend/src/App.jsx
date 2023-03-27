import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from "react";
import './App.css';

import Loading from './components/Loading';
import Authenticated from './middleware/Authenticated';

const Home = lazy(()=>import('./pages/Home'));
const Login = lazy(()=>import('./pages/Login'));
const Register = lazy(()=>import('./pages/Register'));
const Custom404 = lazy(()=>import('./pages/404'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Authenticated type='auth' />}>
            <Route path='/' element={<Home />} />
          </Route>
          <Route element={<Authenticated type='guest' />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route path='*' element={<Custom404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
