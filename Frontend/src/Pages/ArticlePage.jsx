import { useState, useEffect , useContext} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import ArticleCategory from "./ArticleCategory";
import ExploreMore from "./ExploreMore";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaShare } from "react-icons/fa";
import ShareButton from "./ShareButton";
const ArticlePage = ({ userId }) => {
  const [articles,setArticles]=useState(null);
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useContext(UserContext);
  
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
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/getarticle/${slug}`);
        setArticle(res.data);

        setLikes(res.data.likes.length);
        if (user) {
          setLiked(res.data.likes.some(like => like.user === user._id)); // Check if user liked
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, [slug, user]); // Use user instead of userId

  const handleLike = async () => {
    try {
      if (user) {
        const res = await axios.post(`/articles/${article._id}/like`, { userId: user._id }, { headers: { Authorization: `Bearer ${user.token}` } });
        setLikes(res.data.likes);
        setLiked(!liked); // Toggle the liked state
      }
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleComment = async () => {
    try {
      if (user) {
        const res = await axios.post(`/articles/${article._id}/comment`, { userId: user._id, text: comment }, { headers: { Authorization: `Bearer ${user.token}` } });
        setComment(res.data);
        console.log(res.data);
        setComment("");
      }
    } catch (error) {
      console.error("Error commenting on article:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (user) {
        await axios.delete(`/articles/${article._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        alert("Article deleted successfully");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const DisplayContent = ({ content }) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  if (!article) return 
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Loading Article....</p>
    </div>
  ;

  return (
    <div><Navbar/>
    <div className="sm:w-full flex flex-col md:flex-row  justify-between md:px-20">
        <div className="sm:w-full md:max-w-4xl mx-auto p-8 bg-white md:px-20  rounded-2xl">
      {/* Article Image */}
      <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-2">{article.title}</h1>
      {article.tags.map((j,keys)=>(
        <Link to={`/articles/tags/${j}`}  className="bg-yellow-600 px-2 py-1 text-xl cursor-pointer font-bold text-white ">{j}</Link>
      ))}
      <p className="text-yello-700 font-bold mt-2">Posted on {new Date(article.createdAt).toLocaleDateString()}</p>
      <p className="text-yellow-700 text-xl font-bold cursor-pointer mt-2 mb-2 ">Created by {article.author.name}</p>
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt="Article Cover"
          className="w-full h-auto object-cover rounded-lg mb-6"
        />
      )}
      
      {/* Article Title and Meta */}
     
      {user && user.email === article.author.email && (
        <p className="text-gray-500 text-sm font-medium">By {user.email}</p>
      )}
      
      {/* Article Content */}
      <p className="text-lg display-content text-gray-800 mt-6 leading-relaxed"><DisplayContent content={article.content} />
      </p>
      
      {/* Article Actions */}
      <div className="flex items-center gap-4 mt-6">
      <button
  onClick={handleLike}
  className="px-4 py-2 bg-gray-100 rounded-full flex items-center space-x-2 hover:bg-gray-200 active:bg-gray-300 transition-colors"
>
  {liked ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="blue"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  )}
  <span>({likes})</span>
</button>
<ShareButton title={article.title} url={window.location.href} />
        {user && user.email === article.author.email && (
          <div className="h-auto py-2 flex items-center">
          <Link to={`/articles/${article.slug}/edit`} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md">
            
          
            Edit Article
          </Link>
          <button onClick={handleDelete} className='cursor-pointer px-4 hover:text-xl'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

          </button>
          </div>
        )}
      </div>
      
      {/* Comments Section */}
      <div className="mt-10">
  <h2 className="text-3xl font-semibold border-b pb-2">Comments</h2>

  {article.comments.length > 0 ? (
    <>
      {/* Display Top 5 Comments */}
      <div className="space-y-4">
        {article.comments.slice(0, 5).map((comment, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 shadow-md">
            <p className="text-gray-800">{comment.text}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {comment.user.name} • {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Scrollable Section for Remaining Comments */}
      {article.comments.length > 5 && (
        <div className="mt-6 max-h-64 overflow-y-auto border-t pt-4 space-y-4">
          {article.comments.slice(5).map((comment, index) => (
            <div key={index + 5} className="border rounded-lg p-4 bg-gray-50 shadow-md">
              <p className="text-gray-800">{comment.text}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {comment.user.name} • {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  ) : (
    <p className="text-gray-500 mt-3">No comments yet.</p>
  )}

  {/* Comment Input */}
  <div className="mt-6 flex items-center gap-3">
    <input
      type="text"
      placeholder="Write a comment..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
    {user?(
      <button
      onClick={handleComment}
      className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md"
    >
      Post
    </button>
    ):(
<button
      onClick={handleComment}
      className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md"
    >
      Please login to like or comment
    </button>
    )}
    
  </div>
</div>

    </div>

    <div className="min-w-[30vw] py-[100px] px-4 sm:px-8">
  <h1 className="text-3xl sm:text-4xl font-bold mb-4">LATEST</h1>
  <div className="w-[50px] border-b-2 border-red-700 mb-8"></div>
  <div className="space-y-6">
    {articles&&articles.map((i, key) => (
      <Link to={`/articles/${i.slug}`} key={key}  className="group border border-t-0 border-r-0 border-l-0 cursor-pointer border-b-black">
        <div className="w-full gap-4 sm:gap-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center">
          <img
            src={i.coverImage}
            alt={i.title}
            className="w-full sm:w-[150px] h-[250px] md:h-[100px] object-cover rounded-lg"
          />
          <h1 className=" sm:text-xl  font-semibold text-gray-800 group-hover:text-red-700 transition-all duration-300 mt-2 sm:mt-0 text-xl">
            {i.title}
          </h1>
        </div>
        
      </Link>
    ))}
  </div>
</div>
    </div>
    <ExploreMore categoryname={article.category}/>
    <Footer/>
    </div> 
  
  );
};

export default ArticlePage;
