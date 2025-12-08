import { toast } from "sonner";

export const toastWarnNotify = (msg) => {
  toast.warning(msg, {
    duration: 3000,
  });
};

export const toastSuccessNotify = (msg) => {
  toast.success(msg, {
    duration: 3000,
  });
};

export const toastErrorNotify = (msg) => {
  toast.error(msg, {
    duration: 4000,
  });
};

export const toastInfoNotify = (msg) => {
  toast.info(msg, {
    duration: 3000,
  });
};