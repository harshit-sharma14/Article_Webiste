import { useState, useEffect , useContext} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
const ArticlePage = ({ userId }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
const { user } = useContext(UserContext);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/getarticle/${id}`);
        setArticle(res.data);
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
  }, [id, userId]);

  const handleLike = async () => {
    try {
        if(user){
            const res = await axios.post(`/articles/${id}/like`, { userId: user._id }, { headers: { Authorization: `Bearer ${user.token}` } });
            setLikes(res.data.likes);
            setLiked(!liked); // Toggle the liked state
        }
    //   const res = await axios.post(`/articles/${id}/like`, { userId });
    //   setLikes(res.data.likes);
    //   setLiked(!liked); // Toggle the liked state
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };
   const  handleComment= async () => {
    try {
        if(user){
            const res = await axios.post(`/articles/${id}/comment`, { userId: user._id, text:comment }, { headers: { Authorization: `Bearer ${user.token}` } });
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
            if(user){
                await axios.delete(`/articles/${id}`, { headers
                : { Authorization: `Bearer ${user.token}` } });
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
    

  if (!article) return <p>Loading...</p>;

  return (
    <div><Navbar/>
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      {/* Article Image */}
      <h1 className="text-5xl font-bold text-gray-900 leading-tight">{article.title}</h1>
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
          className={`px-6 py-2 font-medium rounded-lg transition-all shadow-md text-white ${
            liked ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {liked ? "Unlike" : "Like"} ({likes})
        </button>
        {user && user.email === article.author.email && (
          <Link to={`/articles/${article._id}/edit`} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md">
            
          
            Edit Article
          </Link>
        )}
      </div>
      
      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold border-b pb-2">Comments</h2>
        {article.comments.length > 0 ? (
          article.comments.map((comment, index) => (
            <div key={index} className="border rounded-lg p-4 mt-4 bg-gray-50 shadow-md">
              <p className="text-gray-800">{comment.text}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {comment.user.name} • {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
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
          <button
            onClick={handleComment}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Post
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </div> 
  
  );
};

export default ArticlePage;
