// Role-based dashboard redirect utility
export const getRoleDashboard = (role) => {
    const dashboardMap = {
        'super_admin': '/admin/dashboard',
        'restaurant_admin': '/restaurant/dashboard',
        'delivery_partner': '/delivery/dashboard',
        'user': '/'
    };

    return dashboardMap[role] || '/';
};
