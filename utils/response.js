 function okResponse({ status, data, res }){
  try {
    const resObj = {
      success: true,
      code: status,
      payload: {
        data: data,
      },
    };
   return res.status(status).send(resObj);
  } catch (err) {
    return err.message;
  }
};
 function errorResponse({ status, message, res }) {
  try {
    const resObj = {
      success: false,
      code: status,
      message: message,
    };
   return res.status(status).send(resObj);
  } catch (err) {
    return err.message;
  }
};

module.exports = {okResponse, errorResponse}