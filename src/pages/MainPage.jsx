import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MainPage() {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }
    return (    
        <div className="container text-center py-5">
            <h2 className="mb-2">SmartQA - Get Started!</h2>
            <p className="mb-4">Please login or register to continue.</p>
            <Link to="/login" className="btn btn-primary me-2">Login</Link>
            <Link to="/signup" className="btn btn-success">Register</Link>
        </div>
    );
}

export default MainPage; 