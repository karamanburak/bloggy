import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastStyle = {
  borderRadius: "12px",
  padding: "16px",
  fontSize: "14px",
  fontWeight: "500",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

export const toastWarnNotify = (msg) => {
  toast.warn(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: toastStyle,
    className: "toast-warning",
  });
};

export const toastSuccessNotify = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: toastStyle,
    className: "toast-success",
  });
};

export const toastErrorNotify = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: toastStyle,
    className: "toast-error",
  });
};
