import { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const EditPost = () => {
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const { id } = useParams();
    const navigate = useNavigate();
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
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`/getarticle/${id}`);
                console.log("Fetched Data:", data); // Debugging
                setFormData(data)
                setFormData((prev) => ({
                    ...prev, 
                    title: data.title || "",
                    content: data.content || "",
                    excerpt: data.excerpt || "",
                    category: data.category || "",
                    tags: data.tags || "",
                    published: data.published || false,
                    author: data.author || "",
                }));
                setIsLoading(false); // Mark loading as complete

    
                setContent(data.content || ""); // Ensures Quill updates
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
    
        fetchPost();
    }, [id]); // Ensure it only runs once
    

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const formDataToSend = new FormData();

            formDataToSend.append("title", formData.title);
            formDataToSend.append("content", content);
            formDataToSend.append("excerpt", formData.excerpt);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("tags", formData.tags);
            formDataToSend.append("published", formData.published);
            formDataToSend.append("author", formData.author);

            if (image) {
                formDataToSend.append("coverImage", image);
            }

            await axios.put(`/postArticle/${id}`, formDataToSend, {
                headers: {"Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}`},
            });

            setMessage("Post updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Post Update Error:", error);
            setMessage(error.response?.data?.message || "Failed to update post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div><Navbar/>
        {isLoading ? (
            <p>Loading</p>
        ) :<div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-[80vw] h-[100vh] bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 w-full">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Edit Post</h2>
            {message && <p className="text-green-600 mb-2">{message}</p>}
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.title|| ""}
              onChange={handleChange}
              required
            />
            <div className="mt-4">
              <ReactQuill
                name="content"
                value={content}
                onChange={handleContentChange}
                className="bg-white display-content h-[60vh]"
                theme="snow"
              />
            </div>
          </div>
          <div className="md:w-1/3 w-full flex flex-col space-y-4">
            <input
              type="text"
              name="excerpt"
              placeholder="Excerpt"
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
              placeholder="Tags"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={formData.tags}
              onChange={handleChange}
            />
            <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
            {image? (
                        <img src={URL.createObjectURL(image)} alt="" className="w-full h-auto object-cover rounded-md" />
                    ):<img src={formData.coverImage||null}></img>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </div>
      </div>}
      </div>
    );
};

export default EditPost;