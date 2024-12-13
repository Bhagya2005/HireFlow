import emailjs from "@emailjs/browser";

const sendEmail = async (templateParams) => {
  const serviceID = "service_gza6g4w"; 
  const templateID = "template_8yqr7ev"; 
  const publicKey = "QFoSKdA7canodCThZ"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default sendEmail;
