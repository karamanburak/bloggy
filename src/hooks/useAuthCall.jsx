import { useDispatch, useSelector } from "react-redux";
import {
  fetchFail,
  fetchStart,
  registerSuccess,
  loginSuccess,
  getUserSuccess,
  updateUserSuccess,
  logoutSuccess,
} from "../features/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const useAuthCall = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.auth);

  const register = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${BASE_URL}users/`, userInfo);
      // console.log(data);
      dispatch(registerSuccess(data.data));
      toastSuccessNotify("Register was successfully");
      
      // Otomatik login işlemi
      try {
        const loginData = await axios.post(`${BASE_URL}auth/login`, {
          email: userInfo.email,
          password: userInfo.password,
        });
        dispatch(loginSuccess(loginData.data));
        toastSuccessNotify(
          `Hello ${loginData.data.user.firstName} ${loginData.data.user.lastName}! Welcome to Bloggy!`
        );
        navigate("/");
      } catch (loginError) {
        // Login başarısız olursa login sayfasına yönlendir
        navigate("/login");
        toastErrorNotify("Registration successful, but automatic login failed. Please login manually.");
      }
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Register can not be performed");
    }
  };

  const login = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${BASE_URL}auth/login`, userInfo);
      // console.log(data);
      dispatch(loginSuccess(data));
      toastSuccessNotify(
        `Hello ${data.user.firstName} ${data.user.lastName}! Great to have you back. Explore what's new and exciting today! `
      );
      navigate("/");
    } catch (error) {
      dispatch(fetchFail());
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An unexpected error occurred";
      toastErrorNotify(errorMessage);
    }
  };
  const updateUser = async (info, id) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.put(`${BASE_URL}users/${id}`, info, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      dispatch(updateUserSuccess(data));
      toastSuccessNotify(`Profile successfully updated`);
      // console.log(data);
    } catch (error) {
      dispatch(fetchFail());
      const errorMessage = error.response.data.message
        ? error.response.data.message
        : "An unexpected error occurred";
      toastErrorNotify(errorMessage);
    }
  };
  const getUser = async (id) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios(`${BASE_URL}users/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      dispatch(getUserSuccess(data));
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(error.message);
    }
  };

  const logout = async () => {
    dispatch(fetchStart());
    try {
      await axios.get(`${BASE_URL}auth/logout`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      dispatch(logoutSuccess());
      toastSuccessNotify(`Logout was successfully`);
      navigate("/login");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Logout cannot be performed!");
    }
  };

  return { register, login, logout, getUser, updateUser };
};
export default useAuthCall;
