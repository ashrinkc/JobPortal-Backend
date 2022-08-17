import mongoose from "mongoose";
import LeaveModel from "../models/LeaveModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { dateDiffInDays } from "../utils/dateSubtractor.js";
import { weekendFinder } from "../utils/weekendFinder.js";
import { mailToEmployee, mailToAdmin } from "../helpers/mailer.js";
import {
  emptyBodyValidator,
  emptyQueryValidator,
  mongooseIdValidator,
  bodyValidator,
  emptyFieldValidator,
} from "../utils/validator.js";
import { okResponse, errorResponse } from "../utils/response.js";

export const addLeave = async (req, res) => {
  try {
    if (emptyQueryValidator(req.query, res) || bodyValidator(req.body, res))
      return;
    let { emp_id, type, startDate, endDate, description } = req.body;
    var fields = [emp_id, type, startDate, endDate, description];
    if (emptyFieldValidator(fields, res) || mongooseIdValidator(emp_id, res));
    let leaveType = type.trim();
    let des = description.trim();
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    var noOfDays = dateDiffInDays(sDate, eDate) + 1;

    if (type === "Unpaid" || type === "Annual" || type === "Sick") {
      noOfDays = weekendFinder(sDate, eDate);
    }

    const validEmp_id = await EmployeeModel.findById(emp_id);
    if (!validEmp_id) {
      return errorResponse({
        status: 200,
        message: "Employee not found",
        res,
      });
    }
    const leaveEmpId = await LeaveModel.find({
      emp_id: { $in: validEmp_id },
    });
    if (!leaveEmpId) {
      return errorResponse({
        status: 200,
        message: "Your leave cannot be found",
        res,
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return errorResponse({
        status: 422,
        message: "Start date must be less than end date!",
        res,
      });
    }

    let pendingLeaveEmp = leaveEmpId.filter((obj) => {
      if (
        ((obj.startDate <= new Date(startDate + "Z") &&
          new Date(startDate + "Z") <= obj.endDate) ||
          (obj.startDate <= new Date(endDate + "Z") &&
            new Date(endDate + "Z") <= obj.endDate)) &&
        (obj.annualLeaveStatus === "Pending" ||
          obj.sickLeaveStatus === "Pending" ||
          obj.maternityLeaveStatus === "Pending" ||
          obj.paternityLeaveStatus === "Pending" ||
          obj.mourningLeaveStatus === "Pending" ||
          obj.unpaidLeaveStatus === "Pending")
      ) {
        return true;
      }
    });
    if (pendingLeaveEmp.length != 0) {
      return errorResponse({
        status: 422,
        message: "The  leave status for that date is already pending!",
        res,
      });
    }

    if (noOfDays <= 0) {
      return errorResponse({
        status: 422,
        message: "Please give valid number of days",
        res,
      });
    }

    if (des === "") {
      return errorResponse({
        status: 400,
        message: "Please add leave description!!",
        res,
      });
    }

    if (des.length < 10) {
      return errorResponse({
        status: 422,
        message: " Leave description is not enough!!",
        res,
      });
    }
    var annualCount = 0;
    var sickCount = 0;
    var maternityCount = 0;
    var paternityCount = 0;
    var mourningCount = 0;
    var unpaidCount = 0;
    var annualLeaveStatus;
    var sickLeaveStatus;
    var maternityLeaveStatus;
    var paternityLeaveStatus;
    var mourningLeaveStatus;
    var unpaidLeaveStatus;

    switch (leaveType) {
      case "Annual":
        if (!(noOfDays <= 12)) {
          return errorResponse({
            status: 422,
            message:
              "The leave must be less than or equal to 12 days for Annual leave !!",
            res,
          });
        }
        annualCount = noOfDays;
        annualLeaveStatus = "Pending";
        break;
      case "Sick":
        if (!(noOfDays <= 12)) {
          return errorResponse({
            status: 422,
            message:
              "Number of days must be less than or equal to 12 for Sick leave!!",
            res,
          });
        }
        sickCount = noOfDays;
        sickLeaveStatus = "Pending";
        break;
      case "Maternity":
        if (!(noOfDays <= 180)) {
          return errorResponse({
            status: 422,
            message:
              "Number of days must be less than or equal to 180 for Maternity leave!!",
            res,
          });
        }
        maternityCount = noOfDays;
        maternityLeaveStatus = "Pending";
        break;
      case "Paternity":
        if (!(noOfDays <= 30)) {
          return errorResponse({
            status: 422,
            message:
              "Number of days must be less than or equal to 30 for Paternity leave!!",
            res,
          });
        }
        paternityCount = noOfDays;
        paternityLeaveStatus = "Pending";
        break;
      case "Mourning":
        if (!(noOfDays <= 20)) {
          return errorResponse({
            status: 422,
            message:
              "Number of days must be less than or equal to 20 for Mourning leave!!",
            res,
          });
        }
        mourningCount = noOfDays;
        mourningLeaveStatus = "Pending";
        break;
      case "Unpaid":
        if (!(noOfDays <= 30)) {
          return errorResponse({
            status: 422,
            message:
              "Number of days must be less than or equal to 30 for Unpaid leave!!",
            res,
          });
        }
        unpaidCount = noOfDays;
        unpaidLeaveStatus = "Pending";
        break;

      default:
        break;
    }
    if (leaveEmpId.length != 0) {
      let leaveCount = leaveEmpId[leaveEmpId.length - 1].type;

      if (leaveCount.Annual + annualCount - 12 > 0) {
        return errorResponse({
          status: 403,
          message: `Your Annual leave count exceeds more than 12 days due to this leave. You have ${
            12 - leaveCount.Annual
          } days of annual leave left! `,
          res,
        });
      } else {
        leaveCount.Annual += annualCount;
      }
      if (leaveCount.Sick + sickCount - 12 > 0) {
        return errorResponse({
          status: 403,
          message: `Your Sick leave count exceeds more than 12 days due to this leave. You have ${
            12 - leaveCount.Sick
          } days of Sick leave left! `,
          res,
        });
      } else {
        leaveCount.Sick += sickCount;
      }
      if (leaveCount.Maternity + maternityCount - 180 > 0) {
        return errorResponse({
          status: 403,
          message: `Your Maternity leave count exceeds more than 180 days due to this leave. You have ${
            180 - leaveCount.Maternity
          } days of Maternity leave left! `,
          res,
        });
      } else {
        leaveCount.Maternity += maternityCount;
      }
      if (leaveCount.Paternity + paternityCount - 30 > 0) {
        return errorResponse({
          status: 403,
          message: `Your Paternity leave count exceeds more than 30 days due to this leave. You have ${
            30 - leaveCount.Paternity
          } days of Paternity leave left! `,
          res,
        });
      } else {
        leaveCount.Paternity += paternityCount;
      }
      if (leaveCount.Mourning + mourningCount - 20 > 0) {
        return errorResponse({
          status: 403,
          message: `Your Mourning leave count exceeds more than 20 days due to this leave. You have ${
            20 - leaveCount.Mourning
          } days of Mourning leave left! `,
          res,
        });
      } else {
        leaveCount.Mourning += mourningCount;
      }
      if (leaveCount.Unpaid + unpaidCount - 30 > 0) {
        return errorResponse({
          status: 403,
          message: `Your Unpaid leave count exceeds more than 30 days due to this leave. You have ${
            30 - leaveCount.unpaidCount
          } days of Unpaid leave left! `,
          res,
        });
      } else {
        leaveCount.Unpaid += unpaidCount;
      }
      var leave = new LeaveModel({
        emp_id,
        currentLeaveType: leaveType,
        type: leaveCount,
        startDate: startDate + "Z",
        endDate: endDate + "Z",
        description,
        annualLeaveStatus,
        sickLeaveStatus,
        maternityLeaveStatus,
        paternityLeaveStatus,
        mourningLeaveStatus,
        unpaidLeaveStatus,
      });
    } else {
      var leave = new LeaveModel({
        emp_id,
        currentLeaveType: leaveType,
        type: {
          Annual: annualCount,
          Sick: sickCount,
          Maternity: maternityCount,
          Paternity: paternityCount,
          Mourning: mourningCount,
          Unpaid: unpaidCount,
        },
        startDate: startDate + "Z",
        endDate: endDate + "Z",
        description,
        annualLeaveStatus,
        sickLeaveStatus,
        maternityLeaveStatus,
        paternityLeaveStatus,
        mourningLeaveStatus,
        unpaidLeaveStatus,
      });
    }

    let data = await leave.save();
    if (!data) {
      return errorResponse({
        status: 500,
        message: "Leaves cannot be created!",
        res,
      });
    }

    let leaveEmployeeAllDetail = await data.populate(
      "emp_id",
      "name email contact -_id"
    );

    const employeeData = {
      startDateOfLeave: leaveEmployeeAllDetail.startDate,
      endDateOfLeave: leaveEmployeeAllDetail.endDate,
      reason: leaveEmployeeAllDetail.description,
      emailOfLeave: leaveEmployeeAllDetail.emp_id.email,
      nameOfEmployee: leaveEmployeeAllDetail.emp_id.name,
      contact: leaveEmployeeAllDetail.emp_id.contact.mobileNumber,
      type: "Submitted",
    };

    mailToEmployee(employeeData);
    mailToAdmin(employeeData);

    okResponse({
      status: 200,
      data: { message: "Leave Added Successfully !!!" },
      res,
    });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    if (
      emptyQueryValidator(req.query, res) ||
      mongooseIdValidator(req.params.leave_id, res) ||
      bodyValidator(req.body, res)
    )
      return;
    const validLeaveId = await LeaveModel.findById(req.params.leave_id);
    if (!validLeaveId) {
      return errorResponse({
        status: 200,
        message: "Leave Id cannot be found",
        res,
      });
    }

    let leaveStatus = req.body;
    let rejectMessage = req.body.rejectMessage;

    if (
      leaveStatus.paternityLeaveStatus === "Rejected" ||
      leaveStatus.maternityLeaveStatus === "Rejected" ||
      leaveStatus.annualLeaveStatus === "Rejected" ||
      leaveStatus.sickLeaveStatus === "Rejected" ||
      leaveStatus.mourningLeaveStatus === "Rejected" ||
      leaveStatus.unpaidLeaveStatus === "Rejected"
    ) {
      if (!rejectMessage) {
        return errorResponse({
          status: 400,
          message: "Please give description for leave rejection!!",
          res,
        });
      }
      const des = rejectMessage.trim();
      des.length < 10;
      if (des.length < 10) {
        return errorResponse({
          status: 422,
          message: "Please give enough reason to reject leave!!",
          res,
        });
      }
    }

    if (
      leaveStatus.paternityLeaveStatus === "Accepted" ||
      leaveStatus.maternityLeaveStatus === "Accepted" ||
      leaveStatus.annualLeaveStatus === "Accepted" ||
      leaveStatus.sickLeaveStatus === "Accepted" ||
      leaveStatus.mourningLeaveStatus === "Accepted" ||
      leaveStatus.unpaidLeaveStatus === "Accepted"
    ) {
      if (rejectMessage) {
        return errorResponse({
          status: 422,
          message: "You dont need to provide rejection message!!",
          res,
        });
      }
      if (rejectMessage === "") {
        return errorResponse({
          status: 422,
          message: "You dont need to provide rejection message!!",
          res,
        });
      }
    }

    var annualCount = validLeaveId.type.Annual;
    var sickCount = validLeaveId.type.Sick;
    var maternityCount = validLeaveId.type.Maternity;
    var paternityCount = validLeaveId.type.Paternity;
    var mourningCount = validLeaveId.type.Mourning;
    var unpaidCount = validLeaveId.type.Unpaid;

    var annualLeaveStatus = validLeaveId.annualLeaveStatus;
    var sickLeaveStatus = validLeaveId.sickLeaveStatus;
    var maternityLeaveStatus = validLeaveId.maternityLeaveStatus;
    var paternityLeaveStatus = validLeaveId.paternityLeaveStatus;
    var mourningLeaveStatus = validLeaveId.mourningLeaveStatus;
    var unpaidLeaveStatus = validLeaveId.unpaidLeaveStatus;

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    function dateDiffInDays(a, b) {
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
    const a = new Date(validLeaveId.startDate);
    const b = new Date(validLeaveId.endDate);
    var noOfDays = dateDiffInDays(a, b) + 1;
    function leaveCheck(X) {
      if (Object.keys(leaveStatus).includes(X)) {
        return true;
      } else return false;
    }
    if (leaveCheck("annualLeaveStatus")) {
      if (rejectMessage) {
        annualCount -= noOfDays;
        if (annualCount < 0) annualCount = 0;
        annualLeaveStatus = "Rejected";
      } else annualLeaveStatus = "Accepted";
    }
    if (leaveCheck("sickLeaveStatus")) {
      if (rejectMessage) {
        sickCount -= noOfDays;
        if (sickCount < 0) sickCount = 0;
        sickLeaveStatus = "Rejected";
      } else sickLeaveStatus = "Accepted";
    }
    if (leaveCheck("maternityLeaveStatus")) {
      if (rejectMessage) {
        maternityCount -= noOfDays;
        if (maternityCount < 0) maternityCount = 0;
        maternityLeaveStatus = "Rejected";
      } else maternityLeaveStatus = "Accepted";
    }
    if (leaveCheck("paternityLeaveStatus")) {
      if (rejectMessage) {
        paternityCount -= noOfDays;
        if (paternityCount < 0) paternityCount = 0;
        paternityLeaveStatus = "Rejected";
      } else paternityLeaveStatus = "Accepted";
    }
    if (leaveCheck("mourningLeaveStatus")) {
      if (rejectMessage) {
        mourningCount -= noOfDays;
        if (mourningCount < 0) mourningCount = 0;
        mourningLeaveStatus = "Rejected";
      } else mourningLeaveStatus = "Accepted";
    }
    if (leaveCheck("unpaidLeaveStatus")) {
      if (rejectMessage) {
        unpaidCount -= noOfDays;
        if (unpaidCount < 0) unpaidCount = 0;
        unpaidLeaveStatus = "Rejected";
      } else unpaidLeaveStatus = "Accepted";
    }

    var rejectReason;
    rejectMessage ? (rejectReason = rejectMessage) : (rejectReason = "");

    let updateLeave = await LeaveModel.findByIdAndUpdate(
      req.params.leave_id,
      {
        type: {
          Annual: annualCount,
          Sick: sickCount,
          Maternity: maternityCount,
          Paternity: paternityCount,
          Mourning: mourningCount,
          Unpaid: unpaidCount,
        },
        annualLeaveStatus,
        sickLeaveStatus,
        paternityLeaveStatus,
        maternityLeaveStatus,
        mourningLeaveStatus,
        unpaidLeaveStatus,
        rejectMessage: rejectReason,
      },
      { new: true }
    ).populate("emp_id", "name email contact ");
    const data = {
      emp_id: updateLeave.emp_id._id,
      type: Object.values(leaveStatus)[0],
      startDateOfLeave: updateLeave.startDate,
      endDateOfLeave: updateLeave.endDate,
      reason: updateLeave.description,
      emailOfLeave: updateLeave.emp_id.email,
      nameOfEmployee: updateLeave.emp_id.name,
      contact: updateLeave.emp_id.contact.mobileNumber,
      leaveStatus: Object.keys(leaveStatus),
    };
    if (rejectMessage) {
      data.rejectMessage = rejectMessage;
    }
    mailToEmployee(data);
    mailToAdmin(data);
    okResponse({ status: 200, data: "Status Updated Successfully", res });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    if (emptyBodyValidator(req.body, res)) return;
    const { page, limit } = req.query;
    if (
      Object.keys(req.query).length === 0 ||
      Object.keys(req.query).includes("page") ||
      Object.keys(req.query).includes("limit")
    ) {
      if (limit <= 0 || page <= 0) {
        return errorResponse({
          status: 422,
          message: "Limit or page is less than zero",
          res,
        });
      }
      var leaves = await LeaveModel.find({
        $or: [
          {
            annualLeaveStatus: "Pending",
          },
          {
            sickLeaveStatus: "Pending",
          },
          {
            maternityLeaveStatus: "Pending",
          },
          {
            paternityLeaveStatus: "Pending",
          },
          {
            mourningLeaveStatus: "Pending",
          },
          {
            unpaidLeaveStatus: "Pending",
          },
        ],
      })
        .populate("emp_id", "name email contact ")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ startDate: "asc" });
    } else {
      return errorResponse({
        status: 400,
        message: "Bad query",
        res,
      });
    }

    let leaveDetails = leaves.map((obj) => ({
      id: obj._id,
      emp_id: obj.emp_id._id,
      currentLeaveType: obj.currentLeaveType,
      type: obj.type,
      startDate: obj.startDate,
      endDate: obj.endDate,
      description: obj.description,
      email: obj.emp_id.email,
      name: obj.emp_id.name,
      contact: obj.emp_id.contact,
      annualLeaveStatus: obj.annualLeaveStatus,
      sickLeaveStatus: obj.sickLeaveStatus,
      maternityLeaveStatus: obj.maternityLeaveStatus,
      paternityLeaveStatus: obj.paternityLeaveStatus,
      mourningLeaveStatus: obj.mourningLeaveStatus,
      unpaidLeaveStatus: obj.unpaidLeaveStatus,
    }));

    const leaveDetailsWithCount = {
      documentCount: leaves.length,
      leaveDetails: leaveDetails,
    };

    okResponse({
      status: 200,
      data: leaveDetailsWithCount,
      res,
    });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};

export const getAcceptedLeaves = async (req, res) => {
  try {
    if (emptyBodyValidator(req.body, res)) return;
    const { page, limit } = req.query;
    if (
      Object.keys(req.query).length === 0 ||
      Object.keys(req.query).includes("page") ||
      Object.keys(req.query).includes("limit")
    ) {
      if (limit <= 0 || page <= 0) {
        return errorResponse({
          status: 422,
          message: "Limit or page is less than zero",
          res,
        });
      }
      var acceptedLeaves = await LeaveModel.find({
        $or: [
          {
            annualLeaveStatus: "Accepted",
          },
          {
            sickLeaveStatus: "Accepted",
          },
          {
            maternityLeaveStatus: "Accepted",
          },
          {
            paternityLeaveStatus: "Accepted",
          },
          {
            mourningLeaveStatus: "Accepted",
          },
          {
            unpaidLeaveStatus: "Accepted",
          },
        ],
      })
        .populate("emp_id", "name email contact ")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ startDate: "asc" });
    } else {
      return errorResponse({
        status: 400,
        message: "Bad query",
        res,
      });
    }

    let upComingLeaves = acceptedLeaves.filter((obj) => {
      let currentDate = new Date().toISOString().slice(0, 10);
      let today = new Date(currentDate + "Z");
      let start = new Date(obj.startDate);
      let end = new Date(obj.endDate);
      let startdateDiff = dateDiffInDays(today, start);
      let enddateDiff = dateDiffInDays(today, end);
      return (
        (startdateDiff >= 0 && startdateDiff < 3) ||
        (obj.startDate <= today && obj.endDate >= today)
      );
    });

    let leaveDetails = upComingLeaves.map((obj) => ({
      id: obj._id,
      emp_id: obj.emp_id._id,
      currentLeaveType: obj.currentLeaveType,
      type: obj.type,
      startDate: obj.startDate,
      endDate: obj.endDate,
      description: obj.description,
      email: obj.emp_id.email,
      name: obj.emp_id.name,
      contact: obj.emp_id.contact,
      annualLeaveStatus: obj.annualLeaveStatus,
      sickLeaveStatus: obj.sickLeaveStatus,
      maternityLeaveStatus: obj.maternityLeaveStatus,
      paternityLeaveStatus: obj.paternityLeaveStatus,
      mourningLeaveStatus: obj.mourningLeaveStatus,
      unpaidLeaveStatus: obj.unpaidLeaveStatus,
    }));

    const leaveDetailsWithCount = {
      documentCount: upComingLeaves.length,
      leaveDetails: leaveDetails,
    };

    okResponse({
      status: 200,
      data: leaveDetailsWithCount,
      res,
    });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    if (emptyBodyValidator(req.body, res)) return;
    const { page, limit } = req.query;
    if (
      Object.keys(req.query).length === 0 ||
      Object.keys(req.query).includes("page") ||
      Object.keys(req.query).includes("limit")
    ) {
      if (limit <= 0 || page <= 0) {
        return errorResponse({
          status: 422,
          message: "Limit or page is less than zero",
          res,
        });
      }
      var leaves = await Promise.all([
        LeaveModel.find()
          .populate("emp_id", "name email contact ")
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ startDate: "desc" }),
        LeaveModel.estimatedDocumentCount(),
      ]);
    } else {
      return errorResponse({
        status: 400,
        message: "Bad query",
        res,
      });
    }

    let leaveDetails = leaves[0].map((obj) => ({
      id: obj._id,
      emp_id: obj.emp_id._id,
      currentLeaveType: obj.currentLeaveType,
      type: obj.type,
      startDate: obj.startDate,
      endDate: obj.endDate,
      description: obj.description,
      email: obj.emp_id.email,
      name: obj.emp_id.name,
      contact: obj.emp_id.contact,
      annualLeaveStatus: obj.annualLeaveStatus,
      sickLeaveStatus: obj.sickLeaveStatus,
      maternityLeaveStatus: obj.maternityLeaveStatus,
      paternityLeaveStatus: obj.paternityLeaveStatus,
      mourningLeaveStatus: obj.mourningLeaveStatus,
      unpaidLeaveStatus: obj.unpaidLeaveStatus,
      rejectMessage: obj.rejectMessage,
    }));

    const leaveDetailsWithCount = {
      documentCount: leaves[1],
      leaveDetails: leaveDetails,
    };

    okResponse({
      status: 200,
      data: leaveDetailsWithCount,
      res,
    });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};

export const getOneLeave = async (req, res) => {
  try {
    if (
      mongooseIdValidator(req.params.emp_id, res) ||
      emptyBodyValidator(req.body, res) ||
      emptyQueryValidator(req.query, res)
    )
      return;

    let employee_id = mongoose.Types.ObjectId(req.params.emp_id);
    const validEmp_id = await EmployeeModel.findById(employee_id);
    if (!validEmp_id) {
      return errorResponse({
        status: 200,
        message: "Employee Id cannot be found",
        res,
      });
    }

    let detailOfLeaveEmployee = await LeaveModel.find({
      emp_id: { $in: validEmp_id },
    })
      .populate("emp_id", "name email contact -_id")
      .sort({ startDate: "asc" });
    if (detailOfLeaveEmployee.length === 0) {
      return errorResponse({
        status: 200,
        message: "Your leave cannot be found",
        res,
      });
    }
    let documentCount = detailOfLeaveEmployee.length;
    okResponse({
      status: 200,
      data: {
        documentCount: documentCount,
        leaveDetails: detailOfLeaveEmployee.map((obj) => ({
          id: obj._id,
          type: obj.type,
          currentLeaveType: obj.currentLeaveType,
          startDate: obj.startDate,
          endDate: obj.endDate,
          description: obj.description,
          email: obj.emp_id.email,
          name: obj.emp_id.name,
          contact: obj.emp_id.contact,
          annualLeaveStatus: obj.annualLeaveStatus,
          sickLeaveStatus: obj.sickLeaveStatus,
          maternityLeaveStatus: obj.maternityLeaveStatus,
          paternityLeaveStatus: obj.paternityLeaveStatus,
          mourningLeaveStatus: obj.mourningLeaveStatus,
          unpaidLeaveStatus: obj.unpaidLeaveStatus,
          rejectMessage: obj.rejectMessage,
        })),
      },
      res,
    });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};

export const deleteOneLeave = async (req, res) => {
  try {
    if (
      mongooseIdValidator(req.params.leave_id, res) ||
      emptyBodyValidator(req.body, res) ||
      emptyQueryValidator(req.query, res)
    )
      return;

    const oneEmployee = await LeaveModel.findByIdAndDelete(req.params.leave_id);
    if (!oneEmployee) {
      return errorResponse({
        status: 500,
        message: "Leave of the employee cannot be deleted",
        res,
      });
    }
    okResponse({ status: 200, data: "Deleted successfully", res });
  } catch (err) {
    errorResponse({ status: 500, message: err.message, res });
  }
};
