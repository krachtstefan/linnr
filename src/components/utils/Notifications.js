import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

const Notifications = () => {
  useEffect(() => {
    if (isChrome === false) {
      toast("FYI: Linnr works best when using Chrome!");
    }
  }, []);

  return <ToastContainer />;
};

export default Notifications;
