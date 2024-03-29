import nodemailer from "nodemailer";

export function stringToBool(data: string) {
  if (data === "true" || (data === "available" && typeof data === "string")) {
    console.log("true data");
    return true;
  } else if (
    data === "false" ||
    (data === "not available" && typeof data === "string")
  ) {
    console.log("elseif false");
    return false;
  } else {
    console.log("false data");
    false;
  }
}

export async function sendMail(data: string, text: string) {
  return new Promise(async (resolve, reject) => {
    const transporter = await nodemailer.createTransport({
      host: "mail.a1future.net",
      port: 465,
      secure: true,
      auth: {
        user: "somnath_dutta@a1future.net",
        pass: "x_z}(hBBb}-e",
      },
    });
    await transporter.sendMail(
      {
        from: "somnath_dutta@a1future.net", // sender address
        to: data, // list of receivers
        subject: "WELCOME MAIL✔", // Subject line
        text: "Do not Share this OTP", // plain text body
        html: `WELCOME ${text} TO OUR APPLICATION, PLEASE COMPLETE VERFICATION PROCESS TO LOGIN`, // html body
      },
      (error, value) => {
        if (error) {
          resolve({ error: "mail not sent" });
        } else if (value.response) {
          resolve({ data: "mail sent" });
        }
      }
    );
  });
}
