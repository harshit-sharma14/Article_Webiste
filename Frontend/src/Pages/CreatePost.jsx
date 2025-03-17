import { useContext, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "./Navbar";
import { UserContext } from "../UserContext";
import Footer from "./Footer";

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        published: false,
        author: "",
    });
    const [content, setContent] = useState("");

    const { user, setUser } = useContext(UserContext);
    console.log(user);    
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    const handleContentChange = (value) => {
        setContent(value);
        setFormData({ ...formData, content: value });
    };
    const getPlainText = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
    
        try {
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
    
            // Prepare FormData to send file + post data
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("content", getPlainText(content));
            formDataToSend.append("excerpt", formData.excerpt);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("tags", formData.tags);
            formDataToSend.append("slug",formData.slug);
            formDataToSend.append("published", formData.published);
            formDataToSend.append("author", formData.author);
            
            if (image) {
                formDataToSend.append("coverImage", image); // Image file
            }
    
            // Send request to backend
            await axios.post("/postArticle", formDataToSend, {
                headers:{"Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}`},
            });
    
            setMessage("Post created successfully!");
            setFormData({
                title: "",
                content: "",
                excerpt: "",
                category: "",
                tags: "",
                published: false,
                author: "",
            });
            setImage(null);
        } catch (error) {
            console.error("Post Creation Error:", error);
            setMessage(error.response?.data?.message || "Failed to create post.");
        } finally {
            setLoading(false);
        }
    };
    if (user && user.role !== "admin") {
      return (
      <div className="w-full h-full flex justify-center item">
      <p className="text-red-600 font-semibold">Not Allowed 🚫</p>;
      </div>
      )
    }

    return (
        <div><Navbar/>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-[80vw] h-[100vh] bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
          {/* Left Side - Title & Content */}
          <div className="md:w-2/3 w-full">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Create a New Post</h2>
            {message && <p className="text-green-600 mb-2">{message}</p>}
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <div className="mt-4">
              <ReactQuill
                name="content"
                value={formData.content}
                onChange={handleContentChange}
                className="bg-white h-[60vh]"
                theme="snow"
              />
            </div>
          </div>
          
          {/* Right Side - Other Fields */}
          <div className="md:w-1/3 w-full flex flex-col space-y-4">
            <input
              type="text"
              name="excerpt"
              placeholder="Excerpt (Short Summary)"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.excerpt}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.tags}
              onChange={handleChange}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="published"
                id="published"
                className="w-4 h-4"
                checked={formData.published}
                onChange={() => setFormData({ ...formData, published: !formData.published })}
              />
              <label htmlFor="published" className="text-gray-700">Publish Now</label>
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </div>
      </div>
      <Footer/>
      </div>



    //     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
    //         <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
    //             <h2 className="text-2xl font-bold text-center text-gray-700">Create a New Post</h2>
    //             {message && <p className="text-center mt-2 text-green-600">{message}</p>}
    //             <form onSubmit={handleSubmit} className="mt-4 space-y-4">
    //                          <input
    //                     type="text"
    //                     name="title"
    //                     placeholder="Title"
    //                     className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
    //                     value={formData.title}
    //                     onChange={handleChange}
    //                     required
    //                 />
    //                 <textarea
    //                     name="content"
    //                     placeholder="Content"
    //                     className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 h-40"
    //                     value={formData.content}
    //                     onChange={handleChange}
    //                     required
    //                 />
    //                  <ReactQuill
    //             name="content"
    //     value={formData.content}
    //     onChange={handleChange}
    //     className="bg-white"
    //     theme="snow" // 'snow' is a clean, simple theme
    //   />      
    //                 <input
    //                     type="text"
    //                     name="excerpt"
    //                     placeholder="Excerpt (Short Summary)"
    //                     className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
    //                     value={formData.excerpt}
    //                     onChange={handleChange}
    //                     required
    //                 />
    //                  <input
    //                     type="text"
    //                     name="author"
    //                     placeholder="Author"
    //                     className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
    //                     value={formData.author}
    //                     onChange={handleChange}
    //                     required
    //                 />
    //                 <input
    //                     type="text"
    //                     name="category"
    //                     placeholder="Category"
    //                     className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
    //                     value={formData.category}
    //                     onChange={handleChange}
    //                     required
    //                 />
    //                 <input
    //                     type="text"
    //                     name="tags"
    //                     placeholder="Tags (comma-separated)"
    //                     className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
    //                     value={formData.tags}
    //                     onChange={handleChange}
    //                 />
    //                 <div className="flex items-center space-x-2">
    //                     <input
    //                         type="checkbox"
    //                         name="published"
    //                         id="published"
    //                         className="w-4 h-4"
    //                         checked={formData.published}
    //                         onChange={() => setFormData({ ...formData, published: !formData.published })}
    //                     />
    //                     <label htmlFor="published" className="text-gray-700">Publish Now</label>
    //                 </div>
    //                 <input
    //                     type="file"
    //                     onChange={handleImageChange}
    //                     className="w-full p-2 border rounded-md"
    //                 />
    //                 <button
    //                     type="submit"
    //                     className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
    //                     disabled={loading}
    //                 >
    //                     {loading ? "Creating..." : "Create Post"}
    //                 </button>
    //             </form>
    //         </div>
    //     </div>
    );
};

export default CreatePost;
