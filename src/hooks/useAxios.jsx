import axios from "axios";
import { useSelector } from "react-redux";

const useAxios = () => {
    const {token} = useSelector(state=> state.auth)

    // Ensure VITE_BASE_URL has a trailing slash and handle undefined
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    
    const axiosWithToken = axios.create({
        baseURL: `${normalizedBaseUrl}api/`,
        headers: { "Authorization": `Token ${token}` }
    });

    // Add response interceptor to handle 404 errors
    axiosWithToken.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 404) {
                console.error("404 Error:", error.config?.url, "Full URL:", error.config?.baseURL + error.config?.url);
            }
            return Promise.reject(error);
        }
    );

  return axiosWithToken
};

export default useAxios;
