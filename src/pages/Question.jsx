import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import { useSelector } from "react-redux";

function Question({ roomCode }) {
    const [question, setQuestion] = useState("");
    const [errors, setErrors] = useState({});
    const userDetails = useSelector((state) => state.user.userDetails);

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (question.length === 0) {
            isValid = false;
            newErrors.question = "Question is mandatory";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const participantName = userDetails?.name;
                const response = await axios.post(
                    `${serverEndpoint}/room/${roomCode}/question`,
                    {
                        content: question,
                        user: participantName ? participantName : "Anonymous",
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: userDetails?.token ? `Bearer ${userDetails.token}` : undefined,
                        },
                    }
                );
                console.log(response);
                setQuestion("");
            } catch (error) {
                console.log(error);
                setErrors({
                    message: "Error posting question, please try again",
                });
            }
        }
    };

    const handleSend = async (message) => {
        if (message.trim().length === 0) {
            setErrors({ question: "Question is mandatory" });
            return;
        }
        
        try {
            const participantName = userDetails?.name;
            const response = await axios.post(
                `${serverEndpoint}/room/${roomCode}/question`,
                {
                    content: message,
                    user: participantName ? participantName : "Anonymous",
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: userDetails?.token ? `Bearer ${userDetails.token}` : undefined,
                    },
                }
            );
            console.log(response);
            setQuestion("");
            setErrors({});
        } catch (error) {
            console.log(error);
            setErrors({
                message: "Error posting question, please try again",
            });
        }
    };

    return (
        <div className="row py-3">
            <div className="col-12">
                <div style={{ 
                    border: errors.question ? '2px solid #dc3545' : '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '10px'
                }}>
                    <MessageInput
                        placeholder="Type your question here..."
                        onSend={handleSend}
                        attachButton={false}
                        sendButton={true}
                        style={{
                            border: 'none',
                            boxShadow: 'none'
                        }}
                    />
                    {errors.question && (
                        <div className="text-danger mt-2 small">{errors.question}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Question;