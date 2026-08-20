import axios from "axios";
const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "https://www.bvgems.com"
    : "";

export const getStudsDetails = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getStudsDetails`);
    return response.data;
  } catch (error) {
    console.error("Error in getting the orders", error);
    return null;
  }
};

export const getOrders = async (email: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/fetchOrders?email=${email}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error in getting the orders", error);
    return null;
  }
};
export const sendCustomJewelryRequest = async (
  email: any,
  variables: any,
  currentUrl: any,
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/sendCustomJewelryRequest`,
      {
        email,
        variables,
        currentUrl,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error in reseting the password", error);
    return null;
  }
};

export const resetPassword = async (token: any, values: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/resetPassword`, {
      token,
      values,
    });
    return response.data;
  } catch (error) {
    console.error("Error in reseting the password", error);
    return null;
  }
};

export const handleForgotPassword = async (email: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/forgotPassword`, {
      email,
    });
    console.log("ressss", response);
    return response;
  } catch (error) {
    console.error("Error in reseting the password", error);
    return null;
  }
};

export const fetchLayoutDataByHandle = async (layout: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/getLayoutDataByHandle`, {
      layout,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching colorstone layouts data", error);
    return null;
  }
};

export const getColorstoneLayouts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getColorstoneLayouts`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching colorstone layouts", error);
    return null;
  }
};
export const getBlogByHandle = async (blogName: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getSingleBlogContent?blogName=${blogName}`,
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching blog post", error);
    return null;
  }
};

export const getBlogPosts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getBlogPosts`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching blog posts", error);
    return null;
  }
};
export const getBestSellingProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getBestSellingProducts`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching best selling products", error);
    return null;
  }
};

export const getFreeSizeFilteredData = async (options: any) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/getFilteredFreeSizeGemstones`,
      {
        options,
      },
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching free size gemstones", error);
    return null;
  }
};
export const submitCustomDesignRequest = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/customJewelryRequest`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while submitting custom design", error);
    return null;
  }
};

export const bookAppointment = async (user: any, payload: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/bookAppointment`, {
      user,
      payload,
    });
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while booking appointment", error);
    return null;
  }
};

export const getHeroData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/fetchHeroData`);
    // console.log("resss of hero", response);
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching hero data", error);
    return null;
  }
};

export const fetchAboutUsData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/fetchAboutUsData`);
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching about us data", error);
    return null;
  }
};

export const fetchFreeSizeGemstonesById = async (id: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getFreeSizeGemstonesById?id=${id}`,
    );
    return response?.data[0];
  } catch (error) {
    console.log("Something went wrong while fetching gemstone data", error);
    return null;
  }
};

export const fetchFreeSizeGemstones = async (gemstone: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getFreeSizeGemstones?gemstone=${gemstone}`,
    );
    console.log("resss of free", response);
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching gemstone data", error);
    return null;
  }
};
export const subscribeEmail = async (email: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/subscribeEmail`, {
      email,
    });

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while submitting inquiry", error);
    return null;
  }
};

export const submitInquiry = async (values: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/sendInquiry`, {
      values,
    });
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while submitting inquiry", error);
    return null;
  }
};

export const handleEmailExists = async (email: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/checkEmailExists?email=${email}`,
    );

    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while checking the email existance",
      error,
    );
    return null;
  }
};
export const sendMemoRequestEmail = async (user: any, cartItems: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/sendMemoRequestEmail`, {
      user,
      cartItems,
    });

    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the orders from shopify",
      error,
    );
    return null;
  }
};
export const fetchAllOrders = async (email: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/fetchOrders?email=${email}`,
    );

    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the orders from shopify",
      error,
    );
    return null;
  }
};
export const createShopifyOrder = async (payload: any) => {
  try {
    console.log("payloadddd", payload);
    const response = await axios.post(
      `${baseUrl}/api/createShopifyOrder`,
      payload,
    );
    console.log("res", response);
    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while sending the order to shopify",
      error,
    );
    return null;
  }
};
export const redirectToStripeCheckout = async (
  cart: any,
  shippingAddress: any,
  guestUser: any,
) => {
  try {
    const response = await axios.post(`${baseUrl}/api/createShopifyCheckout`, {
      cart,
      shippingAddress,
      guestUser,
    });
    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while sending the order to shopify",
      error,
    );
    return null;
  }
};
export const fetchBeads = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getBeads`);

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching the beads", error);
    return null;
  }
};

export const fetchFinishedBeadNecklace = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getFinishedBeadNecklaces`);

    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the finished bead necklaces",
      error,
    );
    return null;
  }
};
export const getFilteredData = async (options: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/getFilteredGemStones`, {
      options,
    });

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while checkout", error);
    return null;
  }
};

export const getFilteredColorStoneLayouts = async (options: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/filter-layouts`, {
      options,
    });

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while checkout", error);
    return null;
  }
};

export const getFilteredJewelry = async (options: any, category: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/fetchFilteredJewelry`, {
      options,
      category,
    });

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while checkout", error);
    return null;
  }
};

export const makeCheckout = async (data: any) => {
  try {
    console.log("data", data);
    const response = await axios.post(`${baseUrl}/api/checkout`, {
      cartItems: data?.cartItems,
      email: data?.email,
      deliveryMethod: data?.deliveryMethod,
      shippingAddress: data?.shippingAddress,
      selectedShippingAddress: data?.selectedShippingAddress,
      user: data?.user,
      guestUser: data?.guestUser,
      paymentMethod: data?.paymentMethod,
    });

    return response?.data;
  } catch (error) {
    console.log("❌ Something went wrong while checkout", error);
    return null;
  }
};

export const getSampleLayoutUrl = async (
  gemstone: string,
  shape: string,
  pattern: string,
  color: string,
) => {
  try {
    const response = await axios.post(`${baseUrl}/api/getSampleLayoutUrl`, {
      gemstone,
      shape,
      pattern,
      color,
    });

    return response?.data?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the color stone layout",
      error,
    );
    return null;
  }
};

export const fetchColorstoneLayouts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getColorstoneLayouts`);
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the color stone layouts");
  }
};

export const fetchProductByHandle = async (handle: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getJewelryProduct?handle=${handle}`,
    );
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the jewelry product data");
  }
};

export const getJewelryData = async (category: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getJewelryData?category=${category}`,
    );
    return response.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching the jewelry category data",
    );
  }
};

export const getStorePolicies = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getStorePolicies`);
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the store policies");
  }
};

export const getFAQs = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getFAQs`);
    return response.data;
  } catch (error) {
    console.log("Something went wrong while fetching the FAQs");
  }
};

export const changeApproveStatus = async (userId: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/approveAccount`, {
      userId,
    });
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
  amlInfo: any,
) => {
  try {
    const response = await axios.post(`${baseUrl}/api/applyForAccount`, {
      stepperUser,
      businessVerification,
      shippingAddress,
      businessReference,
      amlInfo,
    });

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};

export const getUserProfile = async (userId: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getUserProfile?id=${userId}`,
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
      response = await axios.put(
        `${baseUrl}/api/updateShippingAddress`,
        payload,
      );
    } else {
      response = await axios.post(`${baseUrl}/api/storeAddress`, payload);
    }
    return response;
  } catch (error) {
    console.log(
      "Something went wrong while performing operation for shipping address",
    );
  }
};

export const upsertBusinessReference = async (
  isEdit: boolean,
  payload: any,
) => {
  try {
    let response;
    if (isEdit) {
      response = await axios.put(
        `${baseUrl}/api/updateBusinessReference`,
        payload,
      );
    } else {
      response = await axios.post(
        `${baseUrl}/api/storeBusinessReference`,
        payload,
      );
    }
    return response;
  } catch (error) {
    console.log(
      "Something went wrong while performing operation for business reference",
    );
  }
};

export const deleteAddress = async (toDeleteId: any) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/deleteShippingAddress?toDeleteId=${toDeleteId}`,
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while deleting user address");
  }
};

export const deleteReference = async (toDeleteId: any) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/deleteBusinessReference?toDeleteId=${toDeleteId}`,
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while deleting the business reference");
  }
};

export const getShippingAddresses = async (userId: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getShippingAddress?id=${userId}`,
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};
export const getBusinessVerification = async (userId: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getBusinessVerification?id=${userId}`,
    );
    return response?.data;
  } catch (error) {
    console.log(
      "Something went wrong while fetching business verification data",
    );
  }
};

export const getBusinessReferences = async (userId: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getBusinessReferences?id=${userId}`,
    );
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching user profile");
  }
};

export const getAllGemstones = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getGemStones`);

    return response?.data?.products;
  } catch (error) {
    console.log("Something went wrong while fetching gemstones");
  }
};

export const getGemstonesList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/getAllGemStones`);
    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching gemstones");
  }
};

export const getCategoryData = async (handle: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getCategoryData?handle=${handle}`,
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching category data", error);
  }
};

export const getShapesData = async (
  shape: string | null,
  collection?: string,
  isSapphire?: boolean,
  sapphireColor?: string,
) => {
  try {
    const response = await axios.post(`${baseUrl}/api/getShapesData`, {
      shape,
      collection,
      isSapphire,
      sapphireColor,
    });
    return response;
  } catch (error) {
    console.log("Something went wrong while fetching category data");
  }
};

export const handleSignup = async (payload: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/handleSignup`, payload);

    return response.data;
  } catch (error) {
    console.log("Something went wrong while signing up");
  }
};

export const handleSignin = async (payload: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/handleSignin`, payload);

    return response;
  } catch (error) {
    console.log("Something went wrong while signing in", error);
  }
};

export const getParticularProductsData = async (id: string) => {
  try {
    const response = await axios.post(`${baseUrl}/api/getProduct`, id);

    return response.data[0];
  } catch (error) {
    console.log("Something went wrong while signing in", error);
  }
};

export const getTolerance = async (collection: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getTolerance?collection=${collection}`,
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while fetching tolerance", error);
  }
};

export const getGemStoneKnowledge = async (stone: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getGemStoneKnowledge?stone=${stone}`,
    );

    return response?.data;
  } catch (error) {
    console.log("Something went wrong while getting gemstone knowledge", error);
  }
};

export const editProfile = async (payload: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/editProfile`, payload);

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
    const response = await fetch(`${baseUrl}/api/changePassword`, {
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
    const response = await axios.post(`${baseUrl}/api/storeAddress`, payload);

    return response.data;
  } catch (error) {
    console.log("Something went wrong while storing the address");
  }
};

export const getAMLInfo = async (userId: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/getAMLInfo?userId=${userId}`,
    );

    return response.data;
  } catch (error) {
    console.log("Something went wrong while getting AML info");
  }
};
export const editAMLInfo = async (userId: string, data: any) => {
  try {
    const response = await axios.post(`${baseUrl}/api/upsertAMLInfo`, {
      userId,
      data,
    });

    return response.data;
  } catch (error) {
    console.log("Something went wrong while storing the AML info");
  }
};

export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/fetchAllItems`);
    return response?.data?.data;
  } catch (error) {
    console.log("Something went wrong while storing the AML info");
  }
};

export const getSearchResult = async (searchQuery: any, activeFilter: any) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/search?q=${encodeURIComponent(
        searchQuery,
      )}&category=${activeFilter}`,
    );
    console.log("response of search", response);
    return response?.data?.data;
  } catch (error) {
    console.log("Something went wrong while storing the AML info");
  }
};
