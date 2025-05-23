import axios from "axios";

export const getAllGemstones = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/getGemStones");

    return response?.data?.collections;
  } catch (error) {
    console.log("Something went wrong while fetching gemstones");
  }
};

export const getCategoryData = async (handle: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getCategoryData?handle=${handle}`
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching category data");
  }
};

export const getShapesData = async (
  shape: string | null,
  collection: string
) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getShapesData?shape=${shape}&collection=${collection}`
    );
    console.log("response of shape", response);
    return response;
  } catch (error) {
    console.log("Something went wrong while fetching category data");
  }
};

export const handleSignup = async (payload: any) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/handleSignup`,
      payload
    );

    return response.data;
  } catch (error) {
    console.log("Something went wrong while signing up");
  }
};

export const handleSignin = async (payload: any) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/handleSignin`,
      payload
    );
    console.log("res", response);

    return response.data;
  } catch (error) {
    console.log("Something went wrong while signing in", error);
  }
};

export const getParticularProductsData = async (id: string) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/getProduct`,
      id
    );

    return response.data[0];
  } catch (error) {
    console.log("Something went wrong while signing in", error);
  }
};

export const getTolerance = async (collection: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getTolerance?collection=${collection}`
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching tolerance", error);
  }
};

export const getGemStoneKnowledge = async (stone: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getGemStoneKnowledge?stone=${stone}`
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while getting gemstone knowledge", error);
  }
};
