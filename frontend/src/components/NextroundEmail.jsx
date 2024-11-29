import emailjs from "@emailjs/browser";

// Function to send rejection email
const sendProgressEmail = (templateParams) => {
  const serviceID = "service_3qp4dsh"; // Replace with your EmailJS service ID
  const templateID = "template_d6v415i"; // Replace with your EmailJS template ID
  const publicKey = "7j0r-Tr829x5k8ops"; // Replace with your EmailJS user ID

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
};

export default sendProgressEmail;

