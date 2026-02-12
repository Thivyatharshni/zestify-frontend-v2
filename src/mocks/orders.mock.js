export const ORDERS = [
    {
        id: "ORD-12345",
        userId: "USR-001", // Assigned to specific user
        restaurantId: 1,
        restaurantName: "Burger King",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80",
        location: "Downtown",
        items: [
            { name: "Whopper Meal", quantity: 1, price: 159 },
            { name: "Fries (Medium)", quantity: 1, price: 99 }
        ],
        totalAmount: 258,
        status: "DELIVERED",
        date: "2024-01-20T14:30:00",
        rating: 4
    },
    {
        id: "ORD-67890",
        userId: "USR-001",
        restaurantId: 2,
        restaurantName: "Pizza Hut",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
        location: "Main Street",
        items: [
            { name: "Margherita", quantity: 2, price: 299 }
        ],
        totalAmount: 598,
        status: "LIVE",
        date: "2024-01-25T19:45:00",
        rating: null
    }
];
