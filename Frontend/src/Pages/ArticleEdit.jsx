import React from 'react'
import { useState,useEffect,useContext } from 'react';
import { UserContext } from '../UserContext';
import { useParams } from 'react-router-dom';

import axios from 'axios';
const ArticleEdit = () => {
    const [article,setArticle] = useState(null);
    const [likes,setLikes] = useState(0);
    const [liked,setLiked] = useState(false);
    const [comment,setComment] = useState("");
    const { user } = useContext(UserContext);
    const { id } = useParams();
    
   var userId;
if(user){
    userId = user._id;
}
const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    coverImage: "",
    published: false,
    author: "",
});
const [image, setImage] = useState(null);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(null);

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
        formDataToSend.append("content", formData.content);
        formDataToSend.append("excerpt", formData.excerpt);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("tags", formData.tags);
        formDataToSend.append("published", formData.published);
        formDataToSend.append("author", formData.author);
        
        if (image) {
            formDataToSend.append("coverImage", image); // Image file
        }

        // Send request to backend
        await axios.put(`/postArticle/${formData._id}`, formDataToSend, {
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
    useEffect(() => {
        const fetchArticle = async () => {
          try {
            const res = await axios.get(`/getarticle/${id}`);
            setFormData(res.data);
            console.log(res.data);

            setLikes(res.data.likes.length);
            if(user){
                setLiked(res.data.likes.some(like => like.user === user._id)); // Check if user liked
      
            }
          } catch (error) {
            console.error("Error fetching article:", error);
          }
        };
        fetchArticle();
      }, [id]);
  return (
    <div>
          <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Create a New Post</h2>
                {/* {message && <p className="text-center mt-2 text-green-600">{message}</p>} */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="content"
                        placeholder="Content"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 h-40"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
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
                   
                    {image? (
                        <img src={URL.createObjectURL(image)} alt="" className="w-full h-40 object-cover rounded-md" />
                    ):<img src={formData.coverImage||null}></img>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ArticleEdit