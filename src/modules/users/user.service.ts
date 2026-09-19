import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(`
        SELECT * FROM users 
        `);
  return result;
};

const updateUser = async (
  targetUserId: number,
  requesterRole: string,
  requesterId: number,
  payload: any,
) => {
  const { name, email, phone, role } = payload;

  const user = await pool.query(`SELECT id FROM users WHERE id=$1`, [
    targetUserId,
  ]);

  if (!user.rows.length) {
    throw new Error("User not found");
  }

  const isAdmin = requesterRole === "admin";
  const isOwner = targetUserId === requesterId;

  if (!isAdmin && !isOwner) {
    throw new Error("You are not allowed to update this user");
  }

  if (!isAdmin && role) {
    throw new Error("You can not change your role");
  }

  // admin update (only admin can update the role)
  if (isAdmin) {
    const result = await pool.query(
      `
              UPDATE users SET 
                 name= COALESCE($1,name),
                 email= COALESCE($2,email),
                 phone= COALESCE($3,phone),
                 role= COALESCE($4,role) WHERE id=$5
                 RETURNING id,name,email,phone,role

            `,
      [name, email, phone, role, targetUserId],
    );

    return result.rows[0];
  }

  // owner update

  const result = await pool.query(
    `
       UPDATE users SET 
                 name= COALESCE($1,name),
                 email= COALESCE($2,email),
                 phone= COALESCE($3,phone)
                 WHERE id=$4 RETURNING id,name,email,phone,role
    `,
    [name, email, phone, targetUserId],
  );
  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const activeBookings = await pool.query(
    `
        SELECT id FROM bookings WHERE customer_id=$1 AND status= 'active'
        `,
    [id],
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("User cannot be deleted. Active bookings exist.");
  }

  //   delete user if active bookings are not exists

  const result = await pool.query(
    `
    DELETE FROM users WHERE id=$1 RETURNING *
    `,
    [id],
  );

  return result;
};

export const userServices = {
  getUsers,
  updateUser,
  deleteUser,
};
