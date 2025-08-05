import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  console.log(
    "emaillll",
    email,
    process.env.SHOPIFY_STOREFRONT_URL,
    process.env.SHOPIFY_EMAIL_ACCESS_TOKEN
  );

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const response = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/api/2024-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
        variables: {
          input: {
            email,
            acceptsMarketing: true,
          },
        },
      }),
    }
  );

  const result = await response.json();
  console.log("resss", result?.errors[0]?.extensions);

  const errors = result?.data?.customerCreate?.userErrors;
  if (errors?.length) {
    return NextResponse.json({
      flag: false,
      error: "Something went wrong while subscribing, Please Try again later!",
    });
  }

  return NextResponse.json({ flag: true, message: "Successfully subscribed" });
}
