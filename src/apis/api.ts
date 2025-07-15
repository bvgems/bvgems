import axios from "axios";

export const getFilteredData = async (options: any) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/getFilteredGemStones",
      {
        options,
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while checkout", error);
    return null;
  }
};

export const makeCheckout = async (cart: any) => {
  try {
    const response = await axios.post("/api/checkout", {
      cartItems: cart,
    });

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while checkout", error);
    return null;
  }
};

export const getSampleLayoutUrl = async (
  gemstone: string,
  shape: string,
  pattern: string,
  color: string
) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/getSampleLayoutUrl`,
      {
        gemstone,
        shape,
        pattern,
        color,
      }
    );

    return response?.data?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the color stone layout",
      error
    );
    return null;
  }
};

export const fetchColorstoneLayouts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getColorstoneLayouts`
    );
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the color stone layouts");
  }
};

export const fetchProductByHandle = async (handle: any) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getJewerlyProduct?handle=${handle}`
    );
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the jewerly product data");
  }
};

export const getJewerlyData = async (category: any) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getJewerlyData?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the jewerly category data"
    );
  }
};

export const getStorePolicies = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getStorePolicies`
    );
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the store policies");
  }
};

export const getFAQs = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/getFAQs");
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the FAQs");
  }
};

export const changeApproveStatus = async (userId: any) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/approveAccount",
      { userId }
    );
    return response.data;
  } catch (error) {
    console.log("Something went wrong while approving account");
  }
};

export const applyForAccount = async (
  stepperUser: any,
  businessVerification: any,
  shippingAddress: any,
  businessReference: any,
  amlInfo: any
) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/applyForAccount",
      {
        stepperUser,
        businessVerification,
        shippingAddress,
        businessReference,
        amlInfo,
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};

export const getUserProfile = async (userId: any) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getUserProfile?id=${userId}`
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};

export const upsertShippingAddress = async (isEdit: boolean, payload: any) => {
  try {
    let response;
    if (isEdit) {
      response = await axios.put("/api/updateShippingAddress", payload);
    } else {
      response = await axios.post("/api/storeAddress", payload);
    }
    return response;
  } catch (error) {
    console.log(
      "Something went wrong while performing operation for shipping address"
    );
  }
};

export const upsertBusinessReference = async (
  isEdit: boolean,
  payload: any
) => {
  try {
    let response;
    if (isEdit) {
      response = await axios.put("/api/updateBusinessReference", payload);
    } else {
      response = await axios.post("/api/storeBusinessReference", payload);
    }
    return response;
  } catch (error) {
    console.log(
      "Something went wrong while performing operation for business reference"
    );
  }
};

export const deleteAddress = async (toDeleteId: any) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/deleteShippingAddress?toDeleteId=${toDeleteId}`
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while deleting user address");
  }
};

export const deleteReference = async (toDeleteId: any) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/deleteBusinessReference?toDeleteId=${toDeleteId}`
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while deleting the business reference");
  }
};

export const getShippingAddresses = async (userId: any) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getShippingAddress?id=${userId}`
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};
export const getBusinessVerification = async (userId: any) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getBusinessVerification?id=${userId}`
    );
    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching business verification data"
    );
  }
};

export const getBusinessReferences = async (userId: any) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getBusinessReferences?id=${userId}`
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};

export const getAllGemstones = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/getGemStones");

    return response?.data?.products;
  } catch (error) {
    console.log("Something went wrong while fetching gemstones");
  }
};

export const getGemstonesList = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/getAllGemStones"
    );
    return response?.data;
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

    return response;
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

export const editProfile = async (payload: any) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/editProfile`,
      payload
    );

    return response.data;
  } catch (error) {
    console.log("Something went wrong while updating profile");
  }
};

export const handleChangePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await fetch("/api/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (err) {
    return { flag: false, error: "Server error" };
  }
};

export const storeShippingAddress = async (payload: any) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/storeAddress`,
      payload
    );

    return response.data;
  } catch (error) {
    console.log("Something went wrong while storing the address");
  }
};

export const getAMLInfo = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/getAMLInfo?userId=${userId}`
    );

    return response.data;
  } catch (error) {
    console.log("Something went wrong while getting AML info");
  }
};
export const editAMLInfo = async (userId: string, data: any) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/upsertAMLInfo`,
      { userId, data }
    );

    return response.data;
  } catch (error) {
    console.log("Something went wrong while storing the AML info");
  }
};

export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/fetchAllItems`);
    return response?.data?.data;
  } catch (error) {
    console.log("Something went wrong while storing the AML info");
  }
};
