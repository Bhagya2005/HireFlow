import emailjs from "@emailjs/browser";

const sendEmail = (templateParams) => {
  const serviceID = "service_ybchagw"; // Replace with your EmailJS service ID
  const templateID = "template_unuuk4l"; // Replace with your EmailJS template ID
  const publicKey = "E9Ovvtng0ixeyTQQj"; // Replace with your EmailJS public key

  return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendEmail;
