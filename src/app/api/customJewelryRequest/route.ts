import { NextRequest } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import { buildCustomDesignOwnerEmail } from "../helperFunctions/buildCustomDesignOwnerEmail";
import { buildCustomDesignConfirmationEmail } from "../helperFunctions/buildCustomDesignConfirmationEmail";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const user = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    };

    const payload = {
      creationType: formData.get("creationType") as string,
      budget: formData.get("budget") as string,
      centerStone: formData.get("centerStone") as string,
      sideStone: formData.get("sideStone") as string,
      goldColor: formData.get("goldColor") as string,
      additionalDetails: formData.get("additionalDetails") as string,
    };

    // File handling (optional inspiration photo)
    const inspirationFile = formData.get("inspirationFile") as File | null;

    let attachments: any[] = [];
    if (inspirationFile) {
      const buffer = Buffer.from(await inspirationFile.arrayBuffer());
      attachments.push({
        filename: inspirationFile.name,
        content: buffer,
        cid: "inspirationImage",
      });
    }

    const ownerEmailHtml = buildCustomDesignOwnerEmail({
      user,
      payload,
      hasFile: !!inspirationFile,
    });

    const confirmationEmailHtml = buildCustomDesignConfirmationEmail({
      user,
      payload,
    });

    // Send to Shrey (Owner) with optional attachment
    await sendEmail(
      "sales@bvgems.com",
      "New Custom Design Request",
      ownerEmailHtml,
      attachments
    );

    // Send confirmation to customer (no attachment needed)
    await sendEmail(
      user.email,
      "Your Custom Jewelry Request is Confirmed",
      confirmationEmailHtml
    );

    return new Response(
      JSON.stringify({
        flag: true,
        message: `Thank you ${user.fullName}, your custom jewelry request has been received!`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error submitting custom design request:", error);
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
