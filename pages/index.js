import { useEffect, useState } from "react";
import {collection,addDoc,getDocs,where,query,deleteDoc,updateDoc, doc} from "firebase/firestore";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth, } from "@/firebase/auth";
import { GoSignOut } from "react-icons/go";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/router";
const arr = [
    1, 2, 3
];

export default function Home() {
    const { signOut, authUser, isLoading } = useAuth();
    const router = useRouter();
    const [todoInput, setTodoInput] = useState('');
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        if (!isLoading && !authUser) {
            router.replace("/login");
        }
        if (!!authUser) {
            
            fetchTodos(authUser.uid)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser, isLoading]);

    const addTodo = async () => {
        try {

            const docRef = await addDoc(collection(db, "todos"), {
                completed: false,
                content: todoInput,
                owner: authUser.uid,
            });
            console.log("Document written with ID",docRef.id)
            fetchTodos(authUser.uid);
            setTodoInput('');
        } catch (error) {
            console.error(error)
        }
    }
    const fetchTodos = async (uid) => {
        try {
            const q = query(collection(db, "todos"), where("owner", "==", uid));
            const querySnapshot = await getDocs(q)
            let Data = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                Data.push({...doc.data(),id: doc.id})
            })
            setTodos(Data) //

        } catch (error) {
            console.error(error);
        }
    }
    const deleteTodo = async (id) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            fetchTodos(authUser.uid)
            
        } catch (error) {
            console.error(error);
        }
    }
    const markAsComplete = async (event,id) => {
        try {
            console.log(event.target.checked)
            const docRef = doc(db, 'todos', id);
            await updateDoc(docRef, {
                completed: event.target.checked
            })
            fetchTodos(authUser.uid)
        } catch (error) {
            console.error(error);
        }
    }
                            
    const onEnter = (event) => {
        if (event.key === 'Enter' && todoInput.length > 0) {
            addTodo();
        }
    }
    // fetchTodos();
    return (
        <main className="">
            <div className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
            onClick={signOut}
            >
                <GoSignOut size={18} />
                <span>Logout</span>
            </div>
            <div className="  max-w-3xl mx-auto mt-10 p-8">
                <div className="bg-white -m-6 p-3 sticky top-0">
                    <div className="flex justify-center flex-col items-center">
                        
                        <h1 className="text-5xl md:text-6xl font-bold">
                            <span className="text-6xl">📝</span>  ToDoooooo's
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-10">
                        <input
                            type="text"
                            placeholder={`👋 Hello ${authUser?.userName}, What to do Today?`}
                            className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
                            autoFocus
                            value={todoInput}
                            onChange={(e) => setTodoInput(e.target.value)}
                            onKeyUp={(e)=>onEnter(e)}
                        />
                        <button className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
                            onClick={addTodo}
                        >
                            <AiOutlinePlus size={30} color="#fff" />
                        </button>
                    </div>
                </div>
                <div className="my-10">
                    { todos.length >0 && todos.map((todo, index) => (
                        <div key={todo?.id} className="flex items-center justify-between mt-4" >
                            <div className="flex items-center gap-3">
                                <input
                                    id={`todo-${todo.id}`}
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => markAsComplete(e,todo.id)}
                                    className="w-4 h-4 accent-green-400 rounded-lg"
                                />
                                <label
                                    htmlFor={`todo-${todo.id}`}
                                    className={`font-medium ${todo.completed ? 'line-through': " "}`}
                                >
                                    {todo.content}
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <MdDeleteForever
                                    size={24}
                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                    onClick={() => deleteTodo(todo.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
