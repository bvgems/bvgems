import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { createUser } from "../helperFunctions/createUser";
import { createBusinessVerification } from "../helperFunctions/createBusinessVerification";
import { createShippingAddress } from "../helperFunctions/createShippingAddress";
import { createBusinessReference } from "../helperFunctions/createBusinessReference";
import { upsertAMLInfo } from "../helperFunctions/createAMLInfo";
import { buildApplicationEmail } from "../helperFunctions/buildApplicationEmail";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      stepperUser,
      businessVerification,
      shippingAddress,
      businessReference,
      amlInfo,
    } = body;
    const userCreationResponse = await createUser(stepperUser);
    const userId = userCreationResponse?.id;

    businessVerification.companyName = stepperUser?.companyName;
    await createBusinessVerification(businessVerification, userId);

    if (shippingAddress) {
      await createShippingAddress(shippingAddress, userId);
    }
    if (businessReference) {
      await createBusinessReference(businessReference, userId);
    }
    if (amlInfo) {
      await upsertAMLInfo(amlInfo, userId);
    }
    const token = jwt.sign({ userId: userId }, process.env.APPROVAL_SECRET!, {
      expiresIn: "3d",
    });

    const approvalLink = `https://bvgems.com/api/approveAccount?token=${token}`;
    const emailHtml = buildApplicationEmail(
      stepperUser,
      businessVerification,
      shippingAddress,
      businessReference,
      amlInfo,
      approvalLink
    );

    await sendEmail(
      "sales@bvgems.com",
      "New Account Application Received",
      emailHtml
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message: "Application submitted successfully",
        userId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return new Response(
      JSON.stringify({
        flag: false,
        error: "Internal Server Error. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
