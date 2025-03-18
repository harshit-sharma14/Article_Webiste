import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
const ExploreMore = ({categoryname}) => {
    const [articles,setArticles]=useState([]);

    const [loading, setLoading] = useState(true);

    var category=categoryname[0].toUpperCase()+categoryname.slice(1);
    useEffect(() => {
        if (!categoryname) return; // Ensure category is not empty
        
        console.log("Fetching articles for category:", categoryname);
    
        const fetchArticles = async () => {
          try {
            const res = await axios.get(`/getarticles/category?category=${categoryname}`);
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
     
        <div className="w-full mx-auto p-4">
    <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
      More Articles
    </h1>

    {loading ? (
      <p className="text-center text-gray-600">Loading articles...</p>
    ) : articles.length === 0 ? (
      <p className="text-center text-gray-500">No articles found.</p>
    ) : (
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10">
        {articles.map((article) => (
          <div
            key={article._id}
            className="bg-white h-auto shadow-lg rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
          >
            <img
              src={article.coverImage || "https://via.placeholder.com/300"}
              alt={article.title}
              className="w-auto h-[250px] object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{article.title}</h2>
              <p className="text-gray-600 mt-2 text-sm line-clamp-3">{article.excerpt}</p>
              <a
                href={`/articles/${article.slug}`}
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

export default ExploreMore