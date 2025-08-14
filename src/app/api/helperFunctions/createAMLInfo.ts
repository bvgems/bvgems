import { pool } from "@/lib/pool";

export async function upsertAMLInfo(amlInfo: any, userId: any) {
  const { amlStatus } = amlInfo;

  try {
    const result = await pool.query(
      `INSERT INTO aml_info (
        user_id,
        aml_status,
        created_at,
        updated_at
      ) VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        aml_status = EXCLUDED.aml_status,
        updated_at = NOW()
      RETURNING *;`,
      [userId, amlStatus]
    );
    return result;
  } catch (error) {
    console.error("Error in upserting AML info:", error);
    throw error;
  }
}
