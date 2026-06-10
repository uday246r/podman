export function LoadingMessage() {
  return <div className="message">Loading data...</div>;
}

export function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return <div className="message error">{message}</div>;
}
