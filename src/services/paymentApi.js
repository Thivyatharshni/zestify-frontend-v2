export const paymentApi = {
    processPayment: async (amount) => {
        // Simulate payment processing
        return new Promise(resolve => setTimeout(() => resolve({ success: true, transactionId: 'TXN_' + Date.now() }), 2000));
    }
};
