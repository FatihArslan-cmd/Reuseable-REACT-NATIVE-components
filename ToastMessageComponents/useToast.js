import { useState, useEffect } from "react";

const useToast = () => {
  const [toastQueue, setToastQueue] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);

  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      setCurrentToast(toastQueue[0]);
      setToastQueue((prevQueue) => prevQueue.slice(1)); 
    }
  }, [toastQueue, currentToast]);

  const showToast = (type, message) => {
    setToastQueue((prevQueue) => [...prevQueue, { type, message }]);
  };

  const hideToast = () => {
    setCurrentToast(null); 
  };

  return { currentToast, showToast, hideToast };
};

export default useToast;
