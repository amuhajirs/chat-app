import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from "react";
import './App.css';
import './theme.css';

import Loading from './components/Loading';
import Authenticated from './middleware/Authenticated';

import Rooms from './pages/Rooms';
import Friends from './pages/Friends';
import Notification from './pages/Notification';

const Login = lazy(()=>import('./pages/Login'));
const Register = lazy(()=>import('./pages/Register'));
const Forgot = lazy(()=>import('./pages/Forgot'));
const Reset = lazy(()=>import('./pages/Reset'));
const Custom404 = lazy(()=>import('./pages/404'));

const Home = lazy(()=>import('./layouts/Home'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Authenticated type='auth' />}>
            <Route element={<Home />}>
              <Route path='/' element={<Rooms />} />
              <Route path='/friends' element={<Friends />} />
              <Route path='/notification' element={<Notification />} />
            </Route>
          </Route>
          <Route element={<Authenticated type='guest' />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot' element={<Forgot />} />
            <Route path='/reset/:token' element={<Reset />} />
          </Route>
          <Route path='*' element={<Custom404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
