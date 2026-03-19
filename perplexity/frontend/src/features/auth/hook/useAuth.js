import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            await register({ email, username, password });
            
            return { success: true }; 
        } catch (error) {
            const errorMessage = 
                error.response?.data?.errors?.[0]?.msg || 
                error.response?.data?.message ||          
                "Registration failed. Please try again.";
            
            dispatch(setError(errorMessage));
            return { success: false, errorMsg: errorMessage }; 
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await login({ email, password });
            dispatch(setUser(data.user));

            return { success: true }; 
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Invalid email or password";
            dispatch(setError(errorMessage));

            return { success: false, errorMsg: errorMessage }; 
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (err) {
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    }
}