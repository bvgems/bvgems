import { NextRequest } from "next/server";
import { pool } from "@/lib/pool";
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

    let {
      stepperUser,
      businessVerification,
      shippingAddress,
      businessReference,
      amlInfo,
      userId,
    } = body;

    if (userId) {
      // User is already logged in, fetch their existing details
      const userResult = await pool.query(
        `SELECT id, first_name, last_name, email, phone_number, company_name FROM app_users WHERE id = $1`,
        [userId]
      );
      if (userResult.rows.length > 0) {
        const u = userResult.rows[0];
        stepperUser = {
          firstName: u.first_name,
          lastName: u.last_name,
          email: u.email,
          phoneNumber: u.phone_number,
          companyName: u.company_name,
        };
      }
    } else {
      const userCreationResponse = await createUser(stepperUser);
      console.log('use creatonn', userCreationResponse);
      userId = userCreationResponse?.id;
    }

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

    const approvalLink = `https://www.bvgems.com/api/approveAccount?token=${token}`;
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
