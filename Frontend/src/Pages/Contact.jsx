import { useContext, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import './Contact.css'
import { UserContext } from "../UserContext";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const {user}=useContext(UserContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    
    // Handle form submission (e.g., send data to backend or API)
  };

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-black  bg-contact flex items-center justify-center p-4">
      <div className="bg-black text-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold  mb-4 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className=" space-y-4">
          <div>
            <label className="block text-sm font-medium ">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ContactPage;
