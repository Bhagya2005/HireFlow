import emailjs from "@emailjs/browser";

const sendEmail = async (templateParams) => {
  const serviceID = "service_ybchagw"; 
  const templateID = "template_unuuk4l"; 
  const publicKey = "E9Ovvtng0ixeyTQQj"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default sendEmail;
