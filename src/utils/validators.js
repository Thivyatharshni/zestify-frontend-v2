export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
};
