import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Save Error: ", e);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error("Get Error: ", e);
    return null;
  }
};
export const pushData = async (key, newItem) => {
  try {
    const existing = await getData(key);
    const updated = existing ? [...existing, newItem] : [newItem];
    await saveData(key, updated);
  } catch (e) {
    console.error("Push Error: ", e);
  }
};
