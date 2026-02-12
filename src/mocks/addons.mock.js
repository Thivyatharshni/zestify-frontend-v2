export const ADDONS = {
    "item-biryani-1": {
        required: [
            { id: "eb-1", name: "Extra Basmati Rice", price: 40, isAvailable: true, isRequired: true },
            { id: "eb-2", name: "Extra Pieces (2)", price: 99, isAvailable: true, isRequired: true }
        ],
        optional: [
            { id: "raita-1", name: "Mirchi ka Salan", price: 20, isAvailable: true, isRequired: false },
            { id: "raita-2", name: "Extra Raita", price: 10, isAvailable: true, isRequired: false }
        ]
    },
    "item-biryani-2": {
        required: [
            { id: "vb-1", name: "Plain Rice", price: 0, isAvailable: true, isRequired: true }
        ],
        optional: [
            { id: "raita-2", name: "Extra Raita", price: 10, isAvailable: true, isRequired: false }
        ]
    },
    "item-pizza-1": {
        required: [
            { id: "crust-1", name: "New Hand Tossed", price: 0, isAvailable: true, isRequired: true },
            { id: "crust-2", name: "Cheese Burst", price: 99, isAvailable: true, isRequired: true }
        ],
        optional: [
            { id: "cheese-1", name: "Extra Cheese", price: 45, isAvailable: true, isRequired: false },
            { id: "topping-1", name: "Black Olives", price: 30, isAvailable: true, isRequired: false }
        ]
    }
};
