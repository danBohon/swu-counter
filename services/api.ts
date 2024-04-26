const BASE_URL = "https://api.swu-db.com";
import { OFFLINE_BASES } from "../constants/offlineBases";

export async function fetchBases() {
  try {
    const response = await fetch(`${BASE_URL}/cards/search?q=+type%3ABase`);
    if (!response.ok) {
      throw new Error("Failed to fetch bases");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(
      "Error fetching bases:",
      error,
      "Attempting to use offline bases",
    );
    return OFFLINE_BASES.data;
  }
}
