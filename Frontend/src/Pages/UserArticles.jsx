import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const UserArticles = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`/api/articles/${id}`);
                console.log(response)
                setArticles(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [id]);

    return (
        <div className="max-w-full mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">User Articles</h2>
            {loading && <p className="text-center animate-pulse text-gray-600">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && (
                articles.length > 0 ? (
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
                      </div>                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No articles found.</p>
                )
            )}
        </div>
    );
};

export default UserArticles;