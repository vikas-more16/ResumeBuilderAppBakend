// const axios = require("axios");

// const sendOtp = async (phone, otp) => {
//   try {
//     const formattedPhone = phone.replace("+91", "");

//     const response = await axios.post(
//       "https://www.fast2sms.com/dev/bulkV2",
//       {
//         route: "v3", // transactional route
//         numbers: formattedPhone,
//         message: `Your OTP is ${otp}. Valid for 5 minutes.`,
//         sender_id: "TXTIND", // default sender
//       },
//       {
//         headers: {
//           authorization: process.env.FAST2SMS_API_KEY,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     console.log("TRANSACTIONAL SMS SENT:", response.data);
//   } catch (error) {
//     console.error("FAST2SMS FAILED:", error.response?.data || error.message);
//     throw error;
//   }
// };

// module.exports = sendOtp;

const sendOtp = async (phone, otp) => {
  console.log(`DEV OTP for ${phone}: ${otp}`);
};

module.exports = sendOtp;
