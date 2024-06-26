import React, { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "@/firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
const provider = new GoogleAuthProvider();
const RegisterForm = () => {
    const router = useRouter();
    const { authUser, isLoading, setAuthUser } = useAuth();
    const [userName, setUserName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        if (!isLoading && authUser) {
            router.replace("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, isLoading]);

    const signUpHandler = async () => {
        if (!email || !password || !userName) return;
        try {
            const {user} = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: userName,
            });
            console.log(user);
            setAuthUser({
                uid: user.uid,
                email: user.email,
                userName: user.userName,
                accessToken: user?.accessToken,
            });
        } catch (error) {
            console.log("An error occurred ", error);
        }
    };
    const signInWithGoogle = async () => {
        const user = await signInWithPopup(auth, provider);
        console.log(user);
    };
    return (
        <main className="flex lg:h-[100vh]">
            <div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
                <div className="p-8 w-[600px]">
                    <h1 className="text-6xl font-semibold">Sign Up</h1>
                    <p className="mt-6 ml-1">
                        Already have an account ?{" "}
                        <span
                            className="underline hover:text-blue-400 cursor-pointer"
                            onClick={() => router.push("/login")}
                        >
                            Login
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
                            <label>Name</label>
                            <input
                                type="text"
                                required
                                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="mt-10 pl-1 flex flex-col">
                            <label>Email</label>
                            <input
                                required
                                type="email"
                                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mt-10 pl-1 flex flex-col">
                            <label>Password</label>
                            <input
                                required
                                type="password"
                                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
                            onClick={signUpHandler}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
            <div
                className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
                style={{
                    backgroundImage: "url('/login-banner.jpg')",
                }}
            ></div>
        </main>
    );
};

export default RegisterForm;
