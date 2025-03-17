import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
const ArticleTags = () => {
    const [articles,setArticles]=useState([]);
    const {tagName}=useParams();
    const [loading, setLoading] = useState(true);

    var tag=tagName[0].toUpperCase()+tagName.slice(1);
    useEffect(() => {
        if (!tagName) return; // Ensure category is not empty
        
        console.log("Fetching articles for category:", tagName);
    
        const fetchArticles = async () => {
          try {
            const res = await axios.get(`/getarticles/category?category=${tagName}`);
            console.log("Response:", res.data);
            setArticles(res.data.articles);
          } catch (error) {
            console.error("Error fetching articles:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchArticles();
      }, [categoryname]); 
  return (
    <div>
        <Navbar/>
        <div className="max-w-6xl mx-auto p-4">
    <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
      {category} Articles
    </h1>

    {loading ? (
      <p className="text-center text-gray-600">Loading articles...</p>
    ) : articles.length === 0 ? (
      <p className="text-center text-gray-500">No articles found.</p>
    ) : (
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
          >
            <img
              src={article.coverImage || "https://via.placeholder.com/300"}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{article.title}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-3">{article.excerpt}</p>
              <a
                href={`/articles/${article._id}`}
                className="mt-4 inline-block text-blue-500 font-semibold hover:underline"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    )}
  </div></div>
  )
}

export default ArticleTags;