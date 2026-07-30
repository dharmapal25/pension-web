import "./ui.css";

export default function CircularLoader({ label = "Loading...", fullPage = false }) {
  return (
    <div className={`circular-loader${fullPage ? " circular-loader--page" : ""}`} role="status">
      <span className="circular-loader__ring" aria-hidden="true" />
      <span className="circular-loader__label">{label}</span>
    </div>
  );
}
