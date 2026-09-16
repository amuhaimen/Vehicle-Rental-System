import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (typeof password !== "string" || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5)
    RETURNING *`,
    [name, email, hashedPassword, phone, role],
  );

  return result;
};

export const authServices = {
  signupUser,
};
