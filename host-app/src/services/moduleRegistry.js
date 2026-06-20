export async function getModules() {
  const response = await fetch(
    "http://localhost:5137/api/modules"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch modules"
    );
  }

  return response.json();
}