import React, { useState } from 'react';
import Practice from '../../../assets/logo/Practice.jpg'; // Logo image
import logoImage from '../../../assets/logo/logo.png'; // Logo image
import { FcGoogle } from "react-icons/fc";
import { GrApple } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
    }

    else if (password !== confirmPassword) {
      setError("Passwords do not match");
    }

    else {
      setError("");
    }

    // singup API call
    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', { username: name, email, password }, { withCredentials: true });

      if (res.data.status === false) {
        setError(res.data.message);
      }

      setError("");

      navigate('/Login'); // Redirect to login page

    } catch (error) {
      console.log(error.message)
      setError(error.message)
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  return (

    <div className='flex bg-gradient-to-r from-[#F8A128] to-[#F5F5F5] h-screen py-14 px-28'>

      <div className='flex h-full w-full bg-white rounded-[35px] drop-shadow-[5px_5px_6px_rgba(0,0,0,0.2)]'>
        {/*LEFT SIDE*/}
        <div className='flex justify-center items-center w-[40%] h-full p-5'>
          <img className='h-full w-full rounded-2xl' src={Practice} alt="logo" />
        </div>
        {/*RIGHT SIDE*/}
        {/*  LOGO  */}

        <div className='flex flex-col justify-center items-center w-3/5 h-full p-5'>
          <div className=' flex justify-center items-center'>
            <img className='size-12' src={logoImage} alt="logo" />


            <span className=" text-2xl font-Logo ml-[-7.4%] ">
              otetify
            </span>
          </div>

          {/*FILL*/}
          <div className='flex flex-col items-center gap-6'>
            <h1 className='font-semibold text-4xl font-instumrntalSans'>
              Keep Your Notes Organized
            </h1>

            <div className=' flex flex-col items-center' >
              <h1 className='font-medium tracking-tight text-4xl font-instumrntalSans'>
                Welcome Back
              </h1>
              <p className="text-[#7C7B7B] text-center mb-4 text-sm">Enter your Email and password to access your notes account</p>

            </div>
          </div>


          {/*FORM*/}
          <div className='flex flex-col gap-4'>
            <input className='border rounded-3xl border-[#A09F9F] w-96 h-11 p-4' type="text" value={name}
              onChange={(e) => setName(e.target.value)} placeholder='Name' />
            <input className='border rounded-3xl border-[#A09F9F] w-96 h-11 p-4' type="text" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder='Email' />


            <input className='border rounded-3xl border-[#A09F9F] w-96 h-11 p-4' type="text" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder='Password' />


            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}





            <button onClick={handleSubmit} className='w-96 rounded-3xl h-11 p-4 bg-my-yellow text-white font-semibold flex items-center justify-center'>Sign In</button>
            <div className='flex justify-center items-center gap-3'>
              <hr className='w-32  border-[#A09F9F] border' />
              <span className='text-[#827E7E] tracking-tight'>Or Login With</span>
              <hr className='w-32  border-[#A09F9F] border' />
            </div>
            {/*GOOGLE APPLE*/}
            <div className='flex justify-center items-center gap-4'>
              <button>
                <FcGoogle className='size-9' />
              </button>

              <button>
                <GrApple className='size-9' />
              </button>
            </div>
            <div className="flex items-center justify-center mt-4">
              <p className="text-sm font-normal text-[#827E7E]">
                Don't have an account?{" "}
                <span onClick={handleLoginRedirect}
                  className="font-semibold text-black cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>



          </div>


        </div>
      </div>



    </div>
  );
};

export default Signup;