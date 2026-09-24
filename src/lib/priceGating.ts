import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function isUserAuthenticated(req: NextRequest | Request): Promise<boolean> {
  let isAuthenticated = false;

  // Type check for NextRequest to safely access cookies
  if ("cookies" in req && typeof (req as any).cookies.get === "function") {
    const token = (req as any).cookies.get("token")?.value;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        // The token is only issued to approved accounts via handleSignin
        if (decoded && decoded.id) {
          isAuthenticated = true;
        }
      } catch (err) {
        // Token invalid or expired
      }
    }
  }
  
  return isAuthenticated;
}

/**
 * Checks if the request comes from an authenticated user.
 * If not, recursively strips all price-related fields from the data payload.
 */
export async function withPriceGating(req: NextRequest | Request, data: any) {
  const isAuthenticated = await isUserAuthenticated(req);

  // If authenticated, return the original data untouched
  if (isAuthenticated) {
    return data;
  }

  // If not authenticated, recursively strip prices
  const stripPrices = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(stripPrices);
    }
    
    if (obj !== null && typeof obj === "object") {
      const newObj: any = {};
      const keysToStrip = [
        "price",
        "pricerange",
        "compareatprice",
        "minvariantprice",
        "maxvariantprice",
      ];

      for (const key in obj) {
        if (keysToStrip.includes(key.toLowerCase())) {
          newObj[key] = null;
        } else {
          newObj[key] = stripPrices(obj[key]);
        }
      }
      return newObj;
    }
    
    return obj;
  };

  return stripPrices(data);
}
