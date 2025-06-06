import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/pool";

export async function createUser(stepperUser: any) {
  try {
    const { firstName, lastName, email, password, companyName, phoneNumber } =
      stepperUser;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO app_users (first_name, last_name, email, password_hash,company_name,phone_number)
      VALUES ($1, $2, $3, $4,$5,$6)
      RETURNING id, email, created_at;
    `;

    const values: any = [
      firstName,
      lastName,
      email,
      hashedPassword,
      companyName,
      phoneNumber,
    ];
    const result = await pool.query(insertQuery, values);

    const user = result.rows[0];
    return user;
  } catch (error: any) {
    if (error.code === "23505") {
      console.log("error", error);
      return error.message;
    }

    console.error("Error in signing up user:", error);
    return error.message;
  }
}
