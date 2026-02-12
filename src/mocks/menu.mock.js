export const MENU_ITEMS = [
    {
        id: "item-biryani-1",
        restaurant: "biryani-junction",
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with chicken and spices",
        price: 299,
        image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500&q=80",
        category: "Biryani",
        isVeg: false,
        isAvailable: true,
        addons: [
            { id: "ba-1", name: "Extra Pieces (2)", price: 99, isRequired: false, isAvailable: true },
            { id: "ba-2", name: "Extra Raita", price: 10, isRequired: false, isAvailable: true }
        ]
    },
    {
        id: "item-biryani-2",
        restaurant: "biryani-junction",
        name: "Veg Biryani",
        description: "Traditional garden fresh vegetables cooked with layers of basmati rice",
        price: 249,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
        category: "Biryani",
        isVeg: true,
        isAvailable: true,
        addons: [
            { id: "ba-2", name: "Extra Raita", price: 10, isRequired: false, isAvailable: true },
            { id: "ba-3", name: "Salad", price: 20, isRequired: false, isAvailable: true }
        ]
    },
    {
        id: "item-pizza-1",
        restaurant: "6978d32525c80f5f0a157ea6",
        name: "Margherita Pizza",
        description: "Classic tomato sauce, mozzarella and fresh basil",
        price: 199,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500&q=80",
        category: "Pizza",
        isVeg: true,
        isAvailable: true,
        addons: [
            { id: "pa-1", name: "Extra Cheese", price: 45, isRequired: false, isAvailable: true },
            { id: "pa-2", name: "Jalapenos", price: 30, isRequired: false, isAvailable: true }
        ]
    },
    {
        id: "item-pizza-2",
        restaurant: "6978d32525c80f5f0a157ea6",
        name: "Chicken Pizza",
        description: "Barbecue chicken, red onions and cilantro",
        price: 299,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
        category: "Pizza",
        isVeg: false,
        isAvailable: true,
        addons: [
            { id: "pa-1", name: "Extra Cheese", price: 45, isRequired: false, isAvailable: true }
        ]
    }
];
