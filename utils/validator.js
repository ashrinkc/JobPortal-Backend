import { errorResponse } from "./response.js";
import mongoose from "mongoose";


export const contactValidator = (value) => {
  const regex = /^\+?(?:977)?[ -]?(?:(?:(?:98|97)-?\d{8})|(?:01-?\d{7}))$/;
  if (!regex.test(value.trim())) return false;
  return true;
};

export const emailValidator = (value) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(value.trim())) return false;
  return true;
};

export const nameValidator = (value) => {
  const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
  if (!regex.test(value.trim())) return false;
  return true;
};

export const paramsValidator = (params, res) => {
  if (Object.keys(params).length === 0) {
    errorResponse({
      status: 400,
      message: "Bad Request",
      res,
    });
    return true;
  }
};
export const emptyBodyValidator = (body, res) => {
  if (Object.keys(body).length) {
    errorResponse({
      status: 400,
      message: "Bad Request",
      res,
    });
    return true;
  }
};

export const bodyValidator = (body, res) => {
  if (Object.keys(body).length === 0) {
    errorResponse({
      status: 400,
      message: "Bad Request",
      res,
    });
    return true;
  }
};

export const emptyQueryValidator = (query, res) => {
  if (Object.keys(query) != 0) {
    errorResponse({
      status: 400,
      message: "Bad Request",
      res,
    });
    return true;
  }
};
export const emptyFieldValidator = (data, res) => {
  var errorFlag = false;
  data.forEach((element) => {
    if (element.length === 0) {
      errorFlag = true;
    }
  });
  if (errorFlag) {
    errorResponse({
      status: 400,
      message: "Provide all the fields",
      res,
    });
    return true;
  }
};
export const mongooseIdValidator = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    errorResponse({
      status: 400,
      message: " Given Id is not valid!!",
      res,
    });
    return true;
  }
};

export const noRouteValidator = (res) => {
  return errorResponse({
    status: 404,
    message: "No route found",
    res,
  });
};
