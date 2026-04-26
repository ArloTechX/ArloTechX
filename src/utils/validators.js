export const validateContactForm = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\d{10,}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number (minimum 10 digits).';
  }

  if (!values.projectType.trim()) {
    errors.projectType = 'Please select a project type.';
  }

  return errors;
};
