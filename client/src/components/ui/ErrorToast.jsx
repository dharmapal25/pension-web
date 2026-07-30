import { useEffect, useState } from "react";
import "./ui.css";

export default function ErrorToast({ message, onDismiss }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return undefined;
    setVisible(true);
    const timeout = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div className="error-toast" role="alert">
      <span className="error-toast__icon" aria-hidden="true">!</span>
      <p>{message}</p>
      <button type="button" onClick={() => { setVisible(false); onDismiss?.(); }} aria-label="Dismiss error">×</button>
    </div>
  );
}
