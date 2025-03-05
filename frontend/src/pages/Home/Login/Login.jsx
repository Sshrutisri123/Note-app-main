import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../../redux/user/userSlice';
import axios from 'axios';
import Logo1 from '../../../assets/logo/logo1.jpg';
import { FcGoogle } from "react-icons/fc";
import { GrApple } from "react-icons/gr";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../components/loader/loader';
import { auth, provider, signInWithRedirect, getRedirectResult } from "../../../firebaseConfig";  // ✅ Fixed Import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  // ✅ Handle Google Sign-In After Redirect
  useEffect(() => {
    const checkGoogleSignIn = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;
          console.log("Google User:", user);

          dispatch(signInStart());

          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google-signin`, {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          });

          if (!res.data.status) {
            dispatch(signInFailure(res.data.message));
            toast.error(res.data.message);
            return;
          }

          if (res.data.token) {
            sessionStorage.setItem('authToken', res.data.token);
          }

          dispatch(signInSuccess(res.data));
          toast.success(`Welcome, ${user.displayName}!`);

          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast.error("Google Sign-In failed. Please try again.");
        dispatch(signInFailure(error.message));
      }
    };

    checkGoogleSignIn();
  }, [dispatch, navigate]);

  // ✅ Handle Manual Login (Email & Password)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      dispatch(signInStart());

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
        email,
        password
      });

      if (!res.data.status) {
        dispatch(signInFailure(res.data.message));
        toast.error(res.data.message);
        setLoading(false);
        return;
      }

      if (res.data.token) {
        sessionStorage.setItem('authToken', res.data.token);
      }

      dispatch(signInSuccess(res.data));
      toast.success("Login successful!");

      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Handle Google Sign-In with Redirect
  const handleGoogleSignIn = () => {
    dispatch(signInStart());
    signInWithRedirect(auth, provider);
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='flex justify-between bg-gray-100 h-screen py-14 px-28'>
      <ToastContainer />
      <div className='flex flex-col justify-center items-center h-full w-full'>
        <div className='flex justify-center items-center gap-2 mb-6'>
          <img className='sm:size-8 size-7 rounded-lg' src={Logo1} alt="Logo" />
          <span className="text-2xl font-Logo font-semibold">Notify</span>
        </div>

        {/* Right Side */}
        <div className='flex border flex-col rounded-xl shadow-md bg-white justify-center items-center py-5 px-10'>
          <div className='flex flex-col items-center'>
            <h1 className="font-medium text-xl tracking-normal">Welcome Back</h1>
            <p className="text-center text-[#7C7B7B] my-2 text-xs sm:text-sm">
              Enter your Email and password to access Notify
            </p>
          </div>

          {/* Form */}
          <div className='flex flex-col mt-5 gap-3'>
            <div>
              <h3 className='text-sm'>Email</h3>
              <input
                className='border w-72 sm:w-80 rounded-lg h-7 p-4 mt-2 text-sm'
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='m@example.com'
              />
            </div>

            <div>
              <div className='flex justify-between'>
                <h3 className='text-sm'>Password</h3>
              </div>
              <div className="relative">
                <input
                  className="border w-72 sm:w-80 rounded-lg h-7 p-4 mt-2 text-sm pr-10"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute mt-4 right-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              onClick={handleSubmit}
              className='flex justify-center items-center w-72 sm:w-80 rounded-lg h-7 p-4 bg-black text-white font-normal mt-2'>
              Sign in
            </button>

            <div className='flex justify-center items-center gap-3'>
              <hr className='w-20 sm:w-24 border-[#A09F9F] border-1' />
              <span className='text-gray-500 text-sm font-light tracking-tight'>Or login with</span>
              <hr className='w-20 sm:w-24 border-[#A09F9F] border-1' />
            </div>

            <div className='flex flex-col justify-center items-center gap-3'>
              <button
                onClick={handleGoogleSignIn}
                className='flex gap-2 justify-center items-center border border-gray-300 w-72 sm:w-80 rounded-lg h-7 p-4 text-sm hover:bg-gray-100'>
                <FcGoogle className='size-5' />Login with Google
              </button>

              <button className='flex gap-2 justify-center items-center border border-gray-300 w-72 sm:w-80 rounded-lg h-7 p-4 text-sm hover:bg-gray-100'>
                <GrApple className='size-5' />Login with Apple
              </button>
            </div>

            <p className="text-sm font-normal text-[#827E7E]">
              Don't have an account?{" "}
              <span onClick={handleSignUpRedirect} className="font-semibold text-black cursor-pointer underline">
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
