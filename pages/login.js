import React, { useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import {useAuth} from '@/firebase/auth'
const provider = new GoogleAuthProvider();
const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { authUser, isLoading } = useAuth();
    
    useEffect(() => {
        console.log("useEffect is runnign")
        if (!isLoading && authUser) {
            console.log('go to home page')
            router.replace("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[authUser,isLoading])
    const handleLogin = async () => {
        if (!email || !password) return;
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            
        } catch (error) {
            console.error(error);
        }
    };
    const signInWithGoogle = async () => {
        const user = await signInWithPopup(auth, provider);
        // console.log(user);
    };
    return isLoading || (!isLoading && !!authUser) ? <Loader />: (
        <main className="flex lg:h-[100vh]">
            <div
                className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
                style={{
                    backgroundImage: "url('/login-banner.jpg')",
                }}
            ></div>
            <div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
                <div className="p-8 w-[600px]">
                    <h1 className="text-6xl font-semibold">Login</h1>
                    <p className="mt-6 ml-1">
                        Don't have an account ?{" "}
                        <span
                            className="underline hover:text-blue-400 cursor-pointer"
                            onClick={() => router.push("/register")}
                        >
                            Sign Up
                        </span>
                    </p>

                    <div
                        className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
                        onClick={signInWithGoogle}
                    >
                        <FcGoogle size={22} />
                        <span className="font-medium text-black group-hover:text-white">
                            Login with Google
                        </span>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-10 pl-1 flex flex-col">
                            <label>Email</label>
                            <input
                                type="text"
                                onChange={(e) => setEmail(e.target.value)}
                                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                            />
                        </div>
                        <div className="mt-10 pl-1 flex flex-col">
                            <label>Password</label>
                            <input
                                type="password"
                                autoComplete="on"
                                onChange={(e) => setPassword(e.target.value)}
                                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                            />
                        </div>
                        <button
                            className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
                            onClick={handleLogin}
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginForm;
