import PropTypes from "prop-types";
import ReactGA from "react-ga";
import { useEffect } from "react";
import { useHistory } from "react-router";

const sendPageView = location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
  console.debug("GA|Pageview Sent: ", location.pathname);
};

const GAListener = ({ children, trackingId, deactivate = false }) => {
  const history = useHistory();
  useEffect(() => {
    if (trackingId && deactivate === false) {
      ReactGA.initialize(trackingId);
      sendPageView(history.location);
      return history.listen(sendPageView);
    }
  }, [history, trackingId, deactivate]);
  return children;
};

GAListener.propTypes = {
  trackingId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]).isRequired
};

export default GAListener;
