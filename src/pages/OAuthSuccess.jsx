import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../userSlice";
import { jwtDecode } from "jwt-decode";

function OAuthSuccess() {
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            try {
                const user = jwtDecode(token);
                dispatch(setUser({ ...user, token }));
                localStorage.setItem("token", token);
                window.location.replace("/home");
            } catch (e) {
                window.location.replace("/login");
            }
        } else {
            window.location.replace("/login");
        }
    }, [dispatch]);

    return <div>Signing you in...</div>;
}

export default OAuthSuccess; 