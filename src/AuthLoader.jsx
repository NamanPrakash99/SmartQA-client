import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "./userSlice";
import { jwtDecode } from "jwt-decode";

function AuthLoader() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        dispatch(setUser({ ...user, token }));
      } catch (e) {
        localStorage.removeItem("token");
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  return null;
}

export default AuthLoader; 