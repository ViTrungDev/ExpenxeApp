import { getData } from "../utils/storage";

export const testGetData = async () => {
  try {
    const data = await getData("transactions");
    console.log("===== TEST getData =====");
    console.log(data);
    console.log("Type:", Array.isArray(data) ? "Array" : typeof data);
  } catch (error) {
    console.error("getData ERROR:", error);
  }
};
