import { useParams } from "react-router-dom";
import Question from "./Question";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import socket from "../config/socket";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
  Avatar,
  MessageSeparator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useSelector } from "react-redux";

function Room() {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [topQuestions, setTopQuestions] = useState([]);
    const [showTopQuestions, setShowTopQuestions] = useState(false);
    const userDetails = useSelector((state) => state.user.userDetails);

    const fetchTopQuestions = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/room/${code}/top-questions`, {
                withCredentials: true
            });
            setTopQuestions(response.data || []);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch top questions' });
        }
    };

    const fetchRoom = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/room/${code}`, {
                withCredentials: true
            });
            setRoom(response.data);
        } catch (error) {
            setErrors({ message: 'Unable to fetch room details, please try again' });
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/room/${code}/question`, {
                withCredentials: true
            });
            console.log(response);
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch questions, please try again' });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchRoom();
            await fetchQuestions();
            setLoading(false);
        };

        fetchData();

        const joinedCode = code.trim().toUpperCase();
        console.log("Joining socket room:", joinedCode);
        socket.emit("join-room", joinedCode);

        socket.on("new-question", (question) => {
            console.log("Received new-question event:", question);
            setQuestions((prev) => [question, ...prev]);
        });

        socket.on("question-deleted", (questionId) => {
            setQuestions((prev) => prev.filter(q => q._id !== questionId));
        });

        return () => {
            socket.off("new-question");
            socket.off("question-deleted");
        };
    }, []);

    const handleTopQuestionsClick = async () => {
        if (!showTopQuestions) {
            await fetchTopQuestions();
        }
        setShowTopQuestions((prev) => !prev);
    };

    // Delete handler
    const handleDelete = async (questionId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await axios.delete(`${serverEndpoint}/room/${code}/question/${questionId}`, {
                headers: { Authorization: `Bearer ${userDetails?.token}` },
                withCredentials: true
            });
            setQuestions((prev) => prev.filter(q => q._id !== questionId));
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="conatiner text-center py-5">
                <h3>Loading</h3>
                <p>Fetching room details...</p>
            </div>
        );
    }

    if (errors.message) {
        return (
            <div className="conatiner text-center py-5">
                <h3>Error</h3>
                <p>Fetching room details...</p>
            </div>
        );
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getRandomColor = (name) => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        if (!name) return colors[0];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getAvatarImage = (name) => {
        // Array of avatar image paths
        const avatarImages = [
            '/avatars/avatar1.png',
            '/avatars/avatar2.png',
            '/avatars/avatar3.png',
            '/avatars/avatar4.png',
            '/avatars/avatar5.png',
            '/avatars/avatar6.png',
            '/avatars/avatar7.png',
            '/avatars/avatar8.png'
        ];
        
        if (!name) return avatarImages[0];
        const index = name.charCodeAt(0) % avatarImages.length;
        return avatarImages[index];
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Room {code} </h2>
                <button className="btn btn-sm btn-outline-success" onClick={handleTopQuestionsClick}>
                    Get Top Questions
                </button>
            </div>
            <hr />
            {showTopQuestions && topQuestions.length > 0 && (
                <div className="mt-2">
                    <h5>Top Questions</h5>
                    <ul>
                        {topQuestions.map((question, index) => (
                            <li key={index}>{question}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="row">
                <div className="col-12">
                    <div style={{ height: '400px', width: '100%' }}>
                        <MainContainer responsive>
                            <ChatContainer>
                                <MessageList
                                    typingIndicator={loading ? <TypingIndicator content="Loading..." /> : null}
                                    style={{ fontSize: '14px' }}
                                >
                                    {questions.length === 0 ? (
                                        <MessageSeparator content="No questions yet. Be the first to ask!" />
                                    ) : (
                                        questions.map((question, index) => (
                                            <Message
                                                key={question._id || index}
                                                model={{
                                                    message: question.content,
                                                    sentTime: formatTime(question.createdAt),
                                                    sender: question.user || 'Anonymous',
                                                    direction: 'incoming',
                                                    position: 'single'
                                                }}
                                            >
                                                <Avatar
                                                    src={getAvatarImage(question.user)}
                                                    name={question.user || 'Anonymous'}
                                                    size="md"
                                                    style={{
                                                        backgroundColor: getRandomColor(question.user),
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                                {(userDetails?.role === 'host' || userDetails?.role === 'admin') && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger ms-2"
                                                        style={{ fontSize: '10px', padding: '2px 6px', position: 'absolute', right: 10, top: 10 }}
                                                        onClick={() => handleDelete(question._id)}
                                                        title="Delete question"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </Message>
                                        ))
                                    )}
                                </MessageList>
                            </ChatContainer>
                        </MainContainer>
                    </div>
                </div>
            </div>
            <Question roomCode={code} />
        </div>
    );
}

export default Room;