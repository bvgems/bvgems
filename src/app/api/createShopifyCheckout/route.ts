import { NextRequest } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { cart, guestUser, shippingAddress } = await request.json();

    const lineItems = [];

    for (const item of cart) {
      const productId = item.product?.productId;
      if (!productId) {
        throw new Error(
          `Product ID missing for item: ${item.product?.collection_slug}`
        );
      }

      const productQuery = `
        query getProduct($id: ID!) {
          product(id: $id) {
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;

      const productResponse = await axios.post(
        process.env.SHOPIFY_STOREFRONT_URL as string,
        {
          query: productQuery,
          variables: { id: productId },
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token":
              "c64a5e6dbfa340f0bff88be9fde4b7a8",
            "Content-Type": "application/json",
          },
        }
      );

      if (productResponse.data.errors) {
        throw new Error(
          `Error fetching product variants: ${JSON.stringify(
            productResponse.data.errors
          )}`
        );
      }

      const variants = productResponse.data.data.product.variants.edges;
      if (variants.length === 0) {
        throw new Error(
          `No variants found for product: ${item.product?.collection_slug}`
        );
      }

      const variantId = variants[0].node.id;

      lineItems.push({
        merchandiseId: variantId,
        quantity: item.quantity,
      });
    }

    const cartCreateMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
            }
            lines(first: 250) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const cartVariables = {
      input: {
        lines: lineItems,
        buyerIdentity: {
          email: guestUser.email,
          deliveryAddressPreferences: [
            {
              deliveryAddress: {
                address1: shippingAddress.addressLine1,
                city: shippingAddress.city,
                province: shippingAddress.state,
                country: shippingAddress.country,
                zip: shippingAddress.zipCode,
                firstName: shippingAddress.fullName?.split(" ")[0] || "Guest",
                lastName:
                  shippingAddress.fullName?.split(" ").slice(1).join(" ") ||
                  "User",
                phone: shippingAddress.phoneNumber || guestUser.phoneNumber,
              },
            },
          ],
        },
      },
    };

    const response = await axios.post(
      process.env.SHOPIFY_STOREFRONT_UR as string,
      {
        query: cartCreateMutation,
        variables: cartVariables,
      },
      {
        headers: {
          "X-Shopify-Storefront-Access-Token":
            "c64a5e6dbfa340f0bff88be9fde4b7a8",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Shopify cart created:", response.data);

    // Check for GraphQL syntax errors first
    if (response.data.errors) {
      return new Response(
        JSON.stringify({
          flag: false,
          error: "GraphQL syntax errors",
          details: response.data.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check for cart creation errors
    if (response.data.data?.cartCreate?.userErrors?.length > 0) {
      return new Response(
        JSON.stringify({
          flag: false,
          error: "Cart creation failed",
          details: response.data.data.cartCreate.userErrors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newCart = response.data.data.cartCreate.cart;

    return new Response(
      JSON.stringify({
        flag: true,
        cart: newCart,
        checkoutUrl: newCart.checkoutUrl, // This is the URL to redirect users to complete checkout
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating Shopify cart:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        error: "Internal Server Error",
        details: error.response?.data || error.message,
        status: error.response?.status,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
