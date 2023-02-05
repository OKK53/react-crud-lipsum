import { useEffect } from "react";

const Alert = ({ type, msg, removeAlert, lorem }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [lorem, removeAlert]);
  return (
    <p
      className={`mb-4 p-1 w-[25rem] h-8 items-center text-center  font-semibold tracking-tight ${type}`}
    >
      {msg}
    </p>
  );
};

export default Alert;
