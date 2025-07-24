import { useState, useEffect , useContext} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
const ArticlePage1 = ({ userId }) => {
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
              await axios.delete(`/articles/${id}`, {
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
    

  if (!article) return <p>Loading...</p>;

  return (
    <div><Navbar/>
    <div className="w-full flex justify-between">
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
  className={`
    px-6 py-2 font-medium rounded-lg transition-all shadow-md 
    text-white bg-gradient-to-r from-black to-gray-800
    hover:from-gray-800 hover:to-black
    active:scale-95 transform transition-transform duration-200
    flex items-center justify-center space-x-2
  `}
>
  {liked ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
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
        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
      />
    </svg>
  )}
  <span>({likes})</span>
</button>
        {user && user.email === article.author.email && (
          <div className="h-auto py-2 flex items-center">
          <Link to={`/articles/${article._id}/edit`} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md">
            
          
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
    </div>
    <Footer/>
    </div> 
  
  );
};

export default ArticlePage1;
