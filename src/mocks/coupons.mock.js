export const COUPONS = [
    {
        id: "PIZZA20",
        code: "PIZZA20",
        type: "PERCENT",
        value: 20,
        maxDiscount: 80,
        minOrderValue: 199,
        applicableOn: "RESTAURANT",
        restaurant: { $oid: "697d32525c80f50a157ea6" },
        isActive: true,
        expiresAt: "2026-12-31T23:59:59.000Z",
        title: "20% OFF",
        description: "Up to ₹80 on pizzas",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"
    },
    {
        id: "FIRST150",
        code: "FIRST150",
        type: "FLAT",
        value: 150,
        minOrderValue: 299,
        applicableOn: "FIRST_ORDER",
        isActive: true,
        expiresAt: "2026-12-31T23:59:59.000Z",
        title: "₹150 OFF",
        description: "Flat discount on first order",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80"
    },
    {
        id: "SAVE50",
        code: "SAVE50",
        type: "FLAT",
        value: 50,
        minOrderValue: 249,
        applicableOn: "ALL",
        isActive: true,
        expiresAt: "2026-12-31T23:59:59.000Z",
        title: "₹50 OFF",
        description: "Save more on every order",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80"
    }
];
