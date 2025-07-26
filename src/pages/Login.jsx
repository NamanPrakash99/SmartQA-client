import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${serverEndpoint.replace(/\/$/, "")}/auth/login`, form);
            dispatch(setUser({ ...res.data.user, token: res.data.token }));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <h2 className="mb-4 text-center">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="email" name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <input type="password" name="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <hr />
                    <button
                        className="btn btn-danger w-100 mt-2"
                        onClick={() => window.location.href = `${serverEndpoint.replace(/\/$/, '')}/auth/google`}
                    >
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: 20, marginRight: 8, verticalAlign: 'middle' }} />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login; 