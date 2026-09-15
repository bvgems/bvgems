import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

const JWT_SECRET = process.env.JWT_SECRET as string;
const ALLOWED_EMAILS = ["meet.vikartr@gmail.com"];

export async function GET() {
  try {

    // Read the CSV file from src/data
    const dataPath = path.join(process.cwd(), "src", "data", "monthly-data.csv");
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ message: "Data file not found" }, { status: 404 });
    }

    // Parse the CSV using xlsx
    const fileBuffer = fs.readFileSync(dataPath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet) as any[];

    // Whitelist only the necessary columns to prevent leaking sensitive data (e.g. Cost Price) to the client network traffic
    const safeData = jsonData.map(row => ({
      "Item": row["Item"],
      "Shape": row["Shape"],
      "Gem Type": row["Gem Type"],
      "Color": row["Color"],
      "Description": row["Description"],
      "Stock Wt.": row["Stock Wt."],
      "Stock Pcs.": row["Stock Pcs."],
      "Size": row["Size"]
    }));

    return NextResponse.json({ data: safeData }, { status: 200 });
  } catch (error) {
    console.error("Error reading monthly data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
