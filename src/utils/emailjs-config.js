import emailjs from '@emailjs/browser';

// Add console logs for debugging
console.log('Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
console.log('Template ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);

export const sendEmail = async (formData) => {
  try {
    console.log('Sending email with data:', formData);
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      formData,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};
