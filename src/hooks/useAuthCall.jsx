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

const BASE_URL = `${import.meta.env.VITE_BASE_URL}api/`;
const useAuthCall = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.auth);

  const register = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${BASE_URL}users/`, userInfo);
      dispatch(registerSuccess(data.data));
      toastSuccessNotify("Registration successful! Welcome to Bloggy! 🎉");
      
      try {
        const loginData = await axios.post(`${BASE_URL}auth/login`, {
          email: userInfo.email,
          password: userInfo.password,
        });
        dispatch(loginSuccess(loginData.data));
        toastSuccessNotify(
          `Welcome, ${loginData.data.user.firstName}! We're excited to have you here! 🎉`
        );
        setTimeout(() => {
          navigate("/");
        }, 0);
      } catch (loginError) {
        setTimeout(() => {
          navigate("/login");
        }, 0);
        toastErrorNotify("Registration complete! Please sign in to continue.");
      }
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Registration failed. Please check your information and try again.");
    }
  };

  const login = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${BASE_URL}auth/login`, userInfo);
      dispatch(loginSuccess(data));
      toastSuccessNotify(
        `Welcome back, ${data.user.firstName}! Great to see you again. ✨`
      );
      setTimeout(() => {
        navigate("/");
      }, 0);
      return { success: true };
    } catch (error) {
      dispatch(fetchFail());
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An unexpected error occurred";
      toastErrorNotify(errorMessage);
      return { success: false };
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
      toastSuccessNotify("Profile updated successfully! Your changes have been saved.");
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
      toastSuccessNotify("You've been signed out successfully. See you soon! 👋");
      setTimeout(() => {
        navigate("/login");
      }, 0);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify("Unable to sign out. Please try again.");
    }
  };

  return { register, login, logout, getUser, updateUser };
};
export default useAuthCall;
