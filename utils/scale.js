import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const BASE_WIDTH = 375; // iPhone X

export const scale = (size) => (width / BASE_WIDTH) * size;
