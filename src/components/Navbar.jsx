import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../userSlice";

function Navbar() {
    const user = useSelector((state) => state.user.userDetails);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand navbar-light bg-light mb-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">SmartQA</Link>
                <div className="navbar-nav ms-auto">
                    {!isAuthenticated ? (
                        <>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/signup">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <span className="navbar-text me-2">
                                {user?.name} <span className="badge bg-secondary">{user?.role}</span>
                            </span>
                            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 