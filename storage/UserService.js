import { getData, saveData } from "./StorageService";

/**
 * @returns {Promise<User>}
 */
export const getUser = async () => {
  const user = await getData("user");
  return user || {
    id: "local-user",
    name: "Bạn",
    email: "",
  };
};

/**
 * @param {Partial<User>} updatedFields
 */
export const updateUser = async (updatedFields) => {
  const current = await getUser();
  const updatedUser = { ...current, ...updatedFields };
  await saveData("user", updatedUser);
  return updatedUser;
};
