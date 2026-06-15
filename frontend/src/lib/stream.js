import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let client = null;

export const initializeStreamClient = async (user, token) => {
  // 1. Check if user object or user.id is entirely missing
  if (!user || !user.id) {
    console.error("❌ Stream Init Blocked: 'user' object or 'user.id' is missing/undefined", { user, token });
    return null; // Return null instead of crashing the SDK construction
  }

  // 2. Safely check for existing client matching the user ID
  if (client && client.user?.id === user.id) return client;

  if (client) {
    await disconnectStreamClient();
  }

  if (!apiKey) throw new Error("Stream API key is not provided.");

  // 3. Construct client safely now that we know user.id exists
  try {
    client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.name || user.username || "Unknown User", // Defensive fallback
        image: user.image || user.profilePicture,
      },
      token,
    });
    return client;
  } catch (error) {
    console.error("❌ Error initializing Stream Video Client:", error);
    return null;
  }
};

export const disconnectStreamClient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
      client = null;
    } catch (error) {
      console.error("Error disconnecting Stream client:", error);
    }
  }
};