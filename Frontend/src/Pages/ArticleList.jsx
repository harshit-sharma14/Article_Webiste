import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("/getallarticles")
      .then(response => {
        console.log(response.data);
        setArticles(response.data);
      })
      .catch(error => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  return (
    <div><Navbar/>
   <div className="container mx-auto p-6">
  <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900 border-b-4 border-blue-600 pb-3">
    Latest News
  </h1>
  
  {articles.length > 0 && (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Featured Large Article */}
      <Link 
        to={`/articles/${articles[0]._id}`} 
        className="lg:col-span-2 block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
      >
        <div className="relative h-100">
          <img 
            src={articles[0].coverImage} 
            alt={articles[0].title} 
            className="w-full h-96 object-cover"
          />
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs uppercase font-semibold px-3 py-1 rounded-md">
            {articles[0].category || "Top Story"}
          </span>
        </div>
        <div className="p-5">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">{articles[0].title}</h2>
          <p className="text-gray-700 mt-3">{articles[0].excerpt}</p>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>By <span className="font-semibold text-gray-800">{articles[0].author.name}</span></span>
            <span>{new Date(articles[0].publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>

      {/* Side Articles */}
      <div className="grid grid-cols-1 gap-6">
        {articles.slice(1, 5).map(article => (
          <Link 
            to={`/articles/${article._id}`} 
            key={article._id} 
            className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="relative">
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="w-full h-60 object-cover"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs uppercase font-semibold px-3 py-1 rounded-md">
                {article.category || "News"}
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{article.title}</h2>
              <p className="text-gray-700 mt-2 line-clamp-2">{article.excerpt}</p>
              <p className="text-sm text-gray-500 mt-2">
                By <span className="font-semibold text-gray-800">{article.author.name}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )}
</div>


</div>

  );
};

export default ArticlesList;
