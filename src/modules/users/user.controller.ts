import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();

    const users = result.rows.map(({ password, ...rest }) => rest);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const targetUserId = Number(req.params.userId);
    const requesterRole = (req.user as JwtPayload)?.role;
    const requesterId = Number((req.user as JwtPayload)?.userId);
    const result = await userServices.updateUser(
      targetUserId,
      requesterRole,
      requesterId,
      req.body,
    );

    const { password, ...rest } = result;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: rest,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  getUsers,
  updateUser,
  deleteUser,
};
