import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

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

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(
    `
     SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  if (result.rows.length === 0) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const user = result.rows[0];

  const match = bcrypt.compare(password, user.password);

  if (!match) {
    return {
      success: false,
      message: "Wrong password",
    };
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role, userId: user.id },
    config.jwtToken as string,
    {
      expiresIn: "7d",
    },
  );
  delete user.password;
  return { token, user };
};

export const authServices = {
  signupUser,
  signinUser,
};
