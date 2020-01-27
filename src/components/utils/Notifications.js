import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { setChromeInfoSeen, setMobileInfoSeen } from "./../../redux/settings";
import { useDispatch, useSelector } from "react-redux";

const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const isTouchDevice = "ontouchstart" in window;

const Notifications = () => {
  const { hasSeenChromeInfo, hasSeenMobileInfo } = useSelector(state => {
    console.log(state);
    return state.settings;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (hasSeenMobileInfo === false && isTouchDevice === true) {
      toast("No keyboard :(", {
        onClose: () => dispatch(setMobileInfoSeen())
      });
    }
  }, [hasSeenMobileInfo, dispatch]);

  useEffect(() => {
    if (
      isTouchDevice === false &&
      hasSeenChromeInfo === false &&
      isChrome === false
    ) {
      toast("FYI: Linnr works best when using Chrome!", {
        onClose: () => dispatch(setChromeInfoSeen())
      });
    }
  }, [hasSeenChromeInfo, dispatch]);

  return <ToastContainer />;
};

export default Notifications;
