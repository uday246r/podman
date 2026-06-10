const loadRemote = async (importFn, remoteName) => {
try {
return await importFn();
} catch (error) {
console.error(`${remoteName} failed to load`, error);

return {
  default: () => (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        color: "#ef4444",
      }}
    >
      <h2>{remoteName} service unavailable</h2>
      <p>Please try again later.</p>
    </div>
  ),
};

}
};

export default loadRemote;
