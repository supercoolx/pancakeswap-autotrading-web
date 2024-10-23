import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import API from "../utils/api";
import { useAuth } from '../providers/AuthProvider';

const Signin = () => {
  const navigate = useNavigate();
  const { isAuthenticatied, setAuthenticated } = useAuth();

  const [values, setValues] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticatied) navigate('/');
  }, [isAuthenticatied, navigate]);

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    API.post('/auth/login', values).then(res => {
      console.log(res.data);
      setAuthenticated(true);
    }).catch(() => {
      alert('Login failed.');
    });
  }

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.currentTarget.name]: e.currentTarget.value });
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col items-center justify-center w-full mt-10">
      <div className="text-3xl">Sign In</div>
      <div className="mt-10 w-80">
        <div className="">
          <div className="">Email:</div>
          <input name="email" onChange={handleChange} className="w-full px-2 py-1 mt-3 border outline-none border-slate-500" type="email" placeholder="Your email" />
        </div>
        <div className="mt-5">
          <div className="">Password:</div>
          <input name="password" onChange={handleChange} className="w-full px-2 py-1 mt-3 border outline-none border-slate-500" type="password" placeholder="Your password" />
        </div>
      </div>
      <div className="flex items-center justify-center mt-10">
        <button className="px-2 py-1 border border-slate-500">Sign In</button>
      </div>
    </form>
  )
}

export default Signin