import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../providers/contexts";

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticatied, signup } = useAuth();

  const [values, setValues] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticatied) navigate('/');
  }, [isAuthenticatied, navigate]);

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    signup!(values.username, values.email, values.password);
  }

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.currentTarget.name]: e.currentTarget.value });
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col items-center justify-center w-full mt-10">
      <div className="text-3xl">Sign In</div>
      <div className="mt-10 w-80">
        <div className="">
          <div className="">* Username:</div>
          <input name="username" onChange={handleChange} className="w-full px-2 py-1 mt-3 border border-green-500 outline-none invalid:border-red-500" type="text" placeholder="Your username" minLength={3} required />
        </div>
        <div className="mt-5">
          <div className="">* Email:</div>
          <input name="email" onChange={handleChange} className="w-full px-2 py-1 mt-3 border border-green-500 outline-none invalid:border-red-500" type="email" placeholder="Your email" required />
        </div>
        <div className="mt-5">
          <div className="">* Password:</div>
          <input name="password" onChange={handleChange} className="w-full px-2 py-1 mt-3 border border-green-500 outline-none invalid:border-red-500" type="password" placeholder="Your password" minLength={4} required />
        </div>
      </div>
      <div className="flex items-center justify-center mt-10">
        <button className="px-2 py-1 border border-slate-500 error invalid:border-red-500">Sign Up</button>
      </div>
    </form>
  )
}

export default Signup;