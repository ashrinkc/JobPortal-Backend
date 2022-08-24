import bcrypt from "bcrypt";
import EmployeeModel from "../models/EmployeeModel.js";
import RefreshTokenModel from "../models/RefreshTokenModel.js";
import { resetMailer } from "../helpers/mailer.js";
import {
  generateAccessToken,
  generateResetToken,
  generateRefreshToken,
} from "../helpers/jwtHelper.js";
import { okResponse, errorResponse } from "../utils/response.js";
import {
  bodyValidator,
  emptyBodyValidator,
  emptyFieldValidator,
  emptyQueryValidator,
  mongooseIdValidator,
} from "../utils/validator.js";

export const employeeLogin = async (req, res) => {
  try {
    if (emptyQueryValidator(req.query, res) || bodyValidator(req.body, res))
      return;
    let { email, password } = req.body;
    var fields = [email, password];
    if (emptyFieldValidator(fields, res)) return;
    const data = await EmployeeModel.findOne({
      email,
    });

    if (!data) {
      return errorResponse({
        status: 400,
        message: "Invalid email or password",
        res,
      });
    }
    const validPassword = await bcrypt.compare(password, data.password);
    if (!validPassword) {
      return errorResponse({
        status: 422,
        message: "Invalid email or password",
        res,
      });
    }

    const accessToken = await generateAccessToken(data);
    const refreshData = await generateRefreshToken(data);

    const result = {
      name: data.name,
      id: data._id,
      email: data.email,
      contact: data.contact,
      dob: data.dob,
      designation: data.designation,
      isAdmin: data.isAdmin,
      accessToken,
      refreshToken: refreshData.refreshToken,
      imageUrl: data.imageUrl,
    };
    return okResponse({ status: 200, data: result, res });
  } catch (err) {
    return errorResponse({ status: 500, message: err.message, res });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    if (emptyQueryValidator(req.query, res) || bodyValidator(req.body, res))
      return;
    let { email } = req.body;
    if (!email) {
      return errorResponse({
        status: 400,
        message: "Email is required",
        res,
      });
    }
    const data = await EmployeeModel.findOne({ email: req.body.email });
    if (!data) {
      return errorResponse({
        status: 200,
        message: "Email does not exists.",
        res,
      });
    }
    const token = await generateResetToken(data);
    let url = `${process.env.RESET_PASSWORD_URL}/#/reset/${data._id}/${token}`;
    await resetMailer(data.email, data.name, url);
    return okResponse({
      status: 200,
      data: {
        name: data.name,
        email: data.email,
        message: "Mail sent sucessfully.",
      },
      res,
    });
  } catch (err) {
    return errorResponse({ status: 500, message: err.message, res });
  }
};

export const resetPassword = async (req, res) => {
  try {
    if (emptyQueryValidator(req.query, res) || bodyValidator(req.body, res))
      return;
    let { newPassword, confirmPassword } = req.body;
    var fields = [newPassword, confirmPassword];
    if (emptyFieldValidator(fields, res)) return;
    if (newPassword !== confirmPassword) {
      return errorResponse({
        status: 422,
        message: "Password does not match",
        res,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPasswd = await bcrypt.hash(confirmPassword, salt);

    const data = await EmployeeModel.findByIdAndUpdate(req.user._id, {
      password: hashedPasswd,
    });
    if (!data) return errorResponse({ status: 402, message: err.message, res });
    return okResponse({
      status: 200,
      data: "Password was sucessfully changed",
      res,
    });
  } catch (err) {
    return errorResponse({ status: 500, message: err.message, res });
  }
};

export const resetToken = async (req, res) => {
  try {
    if (!res.accessToken) {
      return errorResponse({
        status: 200,
        message: "new token not found..",
        res,
      });
    }
    if (!res.refreshToken || !res.refreshToken.refreshToken) {
      return errorResponse({
        status: 200,
        message: "Error generating refresh token",
        res,
      });
    }
    return okResponse({
      status: 200,
      data: {
        accessToken: res.accessToken,
        refreshToken: res.refreshToken.refreshToken,
      },
      res,
    });
  } catch (error) {
    return errorResponse({ status: 500, message: error.message, res });
  }
};

export const logout = async (req, res) => {
  try {
    if (
      emptyQueryValidator(req.query, res) ||
      emptyBodyValidator(req.body, res)
    )
      return;
    const { authorization } = req.headers;

    if (!authorization) {
      return errorResponse({
        status: 401,
        message: "Access denied. Invalid token",
        res,
      });
    }

    const token = authorization.replace("Bearer ", "");

    const data = await RefreshTokenModel.findOneAndDelete({
      refreshToken: token,
    });
    if (!data) {
      return errorResponse({
        status: 200,
        message: "No token found..",
        res,
      });
    }
    return okResponse({ status: 200, data: "Token removed sucessfully", res });
  } catch (err) {
    return errorResponse({ status: 500, message: err.message, res });
  }
};
