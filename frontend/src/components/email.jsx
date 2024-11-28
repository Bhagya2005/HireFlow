import emailjs from "@emailjs/browser";

const sendEmail = (templateParams) => {
  const serviceID = "service_ybchagw"; 
  const templateID = "template_unuuk4l"; 
  const publicKey = "E9Ovvtng0ixeyTQQj"; 

  return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendEmail;
