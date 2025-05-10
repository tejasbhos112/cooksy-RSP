import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const FeedbackForm = ({ recipeId }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("useEffect triggered - Recipe ID:", recipeId);

        // Fetch user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Check if the user has already reviewed the recipe
        const checkExistingReview = async () => {
            if (!user) return;

            try {
                const { data } = await axios.get(`http://localhost:3000/api/reviews/${recipeId}`);
                console.log(data);
                const userReview = data.find((review) => review.user._id === user._id);
                if (userReview) {
                    setHasReviewed(true);
                }
            } catch (error) {
                console.error("Error checking reviews:", error);
            }
        };

        checkExistingReview();
    }, [recipeId, user]);

    const handleSubmit = async () => {
        const authToken = localStorage.getItem("token"); 
    
        if (!authToken) {
            setError("You must be logged in to submit feedback.");
            console.error("No Auth Token found, cannot submit feedback.");
            return;
        }
    
        console.log("Submitting with Auth Token:", authToken);
    
        try {
            await axios.post(
                `http://localhost:3000/api/reviews/${recipeId}`,
                { rating, comment: feedback },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            setRating(0);
            setFeedback("");
            setError(null);
            setHasReviewed(true);
        } catch (error) {
            console.error("Feedback submission error:", error.response?.data);
            setError(error.response?.data?.message || "Failed to submit feedback.");
        }
    };        
    
    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">Feedback</h2>

            {hasReviewed ? (
                <p className="text-green-600 mt-3">You have already reviewed this recipe.</p>
            ) : (
                <>
                    <div className="flex items-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <textarea
                        className="w-full mt-3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="4"
                        placeholder="Share your thoughts on this recipe..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                        onClick={handleSubmit}
                    >
                        Submit Feedback
                    </button>
                </>
            )}
        </div>
    );
};

export default FeedbackForm;
