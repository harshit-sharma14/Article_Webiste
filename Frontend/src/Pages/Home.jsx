import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import HorizontalScroll from './HorizontalScroll';
const Home = () => {
  const [articles,setArticles]=useState([]);
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
    <div>
      <Navbar />
      {articles && articles.length>0 && <div className="bg-gray-800 from-blue-500 to-indigo-600 text-white text-center py-6 px-4  shadow-lg">
      {/* <div className='flex h-[6vh] justify-between items-center'>
      <h2 className="px-2 sm:h-auto hidden md:block text-sm md:text-xl md:font-bold mb-2">🚀 Check Out Our Latest Post!</h2>
      <p className="sm:text-sm md:text-lg font-medium">{articles[0].title}</p>
      
      <Link to={`/articles/${articles[0]._id}`}
        
        className="mt-4 text-sm  hover:bg-yellow-600 hover:text-white  inline-block bg-white text-blue-600 font-semibold py-1 px-4 md:py-2 rounded-full shadow-md  transition-all"
      >
        Read Now →
      </Link>
      </div> */}
      <HorizontalScroll articles={articles} />
    </div>}
    {/* <div className='w-full h-full flex flex-col items-center'> */}
      <div className="w-[100vw] flex flex-col lg:flex-row justify-center items-start px-6 py-8 bg-gray-50 min-h-screen">
        {/* Left Side - Featured Article */}
        {articles && articles.length > 0 && (
          <div className="lg:w-[60%] w-full flex flex-col items-center p-4">
            <Link to={`/articles/${articles[0]._id}`} className="relative w-full h-[70vh] rounded-lg overflow-hidden shadow-lg">
              <img
                src={articles[0].coverImage}
                className="w-full cursor-pointer hover:scale(110%) h-full object-cover brightness-90 hover:brightness-100 transition duration-300"
                alt="Main Article"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs uppercase font-semibold px-3 py-1 rounded-md">
            {articles[0].category || "Top Story"}
          </span>
              <div className="absolute  hover:text-black transition-all duration-300 bottom-0 bg-gradient-to-t from-black/80  to-transparent w-full p-6">
                <h2 className="text-2xl font-bold text-white">{articles[0].title}</h2>
                <p className='text-sm text-white'>{articles[0].excerpt}</p>
              </div>
            </Link>
          </div>
        )}

        {/* Right Side - Other News */}
        <div className="lg:w-[40%] w-full flex flex-col gap-6 p-4">
          <h3 className="text-xl font-semibold text-gray-700">Latest News</h3>
          {articles &&
            articles.slice(1, 5).map((article, index) => (
              <Link to={`/articles/${article._id}`}
                key={index}
                className="w-full flex items-center gap-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <img
                  src={article.coverImage}
                  className="h-[12vh] w-[12vh] object-cover rounded-md"
                  alt="News Thumbnail"
                />
                <div className='flex flex-col gap-1'> 
                <h3 className="text-md font-medium text-gray-800 hover:text-blue-600 transition duration-200">
                  {article.title}
                </h3>
                <p className='text-sm text-gray-700 overflow-hidden'> {article.excerpt.length > 100 ? article.excerpt.slice(0, 100) + "..." : article.excerpt}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Bottom Section - More Articles */}
      <div className="w-full px-6  bg-white">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">More Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles &&
            articles.slice(5).map((article, index) => (
              <Link to={`/articles/${article._id}`}
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <img
                  src={article.coverImage}
                  className="w-full h-40 object-cover rounded-md mb-4"
                  alt="More News"
                />
                <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 transition duration-200">
                  {article.title}
                </h3>
                <p className='text-sm text-gray-700 overflow-hidden'> {article.excerpt.length > 50 ? article.excerpt.slice(0, 100) + "..." : article.excerpt}</p>
              </Link>
            ))}
        </div>
      </div>
      {/* </div> */}
      <Footer/>
    </div>
  )
}

export default Home