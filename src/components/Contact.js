const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };
    
    console.log('Form data:', formData);
    const response = await sendEmail(formData);
    console.log('Response:', response);
    
    // Clear form after successful submission
    e.target.reset();
    
  } catch (error) {
    console.error('Form submission error:', error);
    // Show error message to user
  }
};
