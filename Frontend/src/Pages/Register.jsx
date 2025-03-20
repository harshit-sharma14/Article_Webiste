import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";

const Register = () => {
    const { setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
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
            const { data } = await axios.post("/api/register", formData);
            setUser(data);
            alert("User registered successfully");
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.msg || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700">Create an Account</h2>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
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
                        placeholder="Create Password"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="avatar"
                        placeholder="Profile Picture URL (Optional)"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formData.avatar}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;