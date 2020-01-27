import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { setChromeInfoSeen } from "./../../redux/settings";

const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

const Notifications = () => {
  const { hasSeenChromeInfo } = useSelector(state => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasSeenChromeInfo === false && isChrome === false) {
      toast("FYI: Linnr works best when using Chrome!", {
        onClose: () => dispatch(setChromeInfoSeen())
      });
    }
  }, [hasSeenChromeInfo, dispatch]);

  return <ToastContainer />;
};

export default Notifications;
