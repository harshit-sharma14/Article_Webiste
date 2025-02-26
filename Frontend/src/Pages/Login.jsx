import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";
const Login = () => {
    const [redirect,setRedirect]=useState(false);
    const { user,setUser,setReady,ready } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/login", formData);
            const { token, user } = response.data;
            console.log(token);
            console.log(user);
            setUser(user);
            console.log(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setRedirect(true);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.msg || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };


    if(redirect){  
        return <Navigate to="/"/>
    }


    return (
        <div>
            <Navbar />
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
                
                {/* Registration Section */}
                <div className="w-full max-w-md bg-white p-6 mt-6 rounded-lg shadow-lg text-center">
                    <p className="text-gray-600">Don't have an account?</p>
                    <a href="/register" className="text-blue-500 hover:underline">Register here</a>
                </div>
            </div>
        </div>
    );
};

export default Login;