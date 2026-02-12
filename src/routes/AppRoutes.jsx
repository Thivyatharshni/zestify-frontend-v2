import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from './RouteConstants';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import HomeRedirect from '../components/common/HomeRedirect';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Search from '../pages/Search';
import Restaurant from '../pages/Restaurant';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderTracking from '../pages/OrderTracking';
import Profile from '../pages/Profile';
import CategoryPage from '../pages/CategoryPage';
import NotFound from '../pages/NotFound';
import Food from '../pages/Food';

// Restaurant Dashboard
import RestaurantDashboard from '../pages/restaurant/Dashboard';
import RestaurantMenu from '../pages/restaurant/Menu';
import RestaurantOrders from '../pages/restaurant/Orders';
import RestaurantProfile from '../pages/restaurant/Profile';

// Delivery Dashboard
import DeliveryDashboard from '../pages/delivery/Dashboard';
import DeliveryOrders from '../pages/delivery/Orders';
import DeliveryEarnings from '../pages/delivery/Earnings';
import DeliveryHistory from '../pages/delivery/History';
import DeliveryProfile from '../pages/delivery/Profile';

// Admin Dashboard
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminRestaurants from '../pages/admin/Restaurants';
import AdminDeliveryPartners from '../pages/admin/DeliveryPartners';
import AdminOrders from '../pages/admin/Orders';
import CMSHeroEditor from '../pages/admin/CMSHeroEditor';
import CMSCategoryEditor from '../pages/admin/CMSCategoryEditor';
import CMSLaneEditor from '../pages/admin/CMSLaneEditor';
import CMSOfferEditor from '../pages/admin/CMSOfferEditor';
import CMSFooterEditor from '../pages/admin/CMSFooterEditor';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === ROUTES.HOME;
    const hideHeaderFooter = [ROUTES.LOGIN, ROUTES.SIGNUP].includes(location.pathname);

    return (
        <>
            {!hideHeaderFooter && <Header />}
            <main className={`min-h-[calc(100vh-80px-300px)] ${!hideHeaderFooter && !isHome ? 'pt-20' : ''}`}>
                {children}
            </main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
};

// Wrapper for routes that need the layout
const PageWrapper = ({ component: Component }) => (
    <Layout>
        <Component />
    </Layout>
);

// ... imports
import StaticPage from '../pages/StaticPage';

// ... existing code

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={
                <HomeRedirect>
                    <PageWrapper component={Home} />
                </HomeRedirect>
            } />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.SEARCH} element={<PageWrapper component={Search} />} />
            <Route path={ROUTES.RESTAURANT} element={<PageWrapper component={Restaurant} />} />
            <Route path="/category/:categorySlug" element={<PageWrapper component={CategoryPage} />} />
            <Route path="/food" element={<PageWrapper component={Food} />} />

            {/* Protected Routes */}
            <Route path={ROUTES.CART} element={
                <ProtectedRoute>
                    <PageWrapper component={Cart} />
                </ProtectedRoute>
            } />
            <Route path={ROUTES.CHECKOUT} element={
                <ProtectedRoute>
                    <PageWrapper component={Checkout} />
                </ProtectedRoute>
            } />
            <Route path={ROUTES.ORDERS} element={
                <ProtectedRoute>
                    <PageWrapper component={Orders} />
                </ProtectedRoute>
            } />
            <Route path={ROUTES.ORDER_TRACKING} element={
                <ProtectedRoute>
                    <PageWrapper component={OrderTracking} />
                </ProtectedRoute>
            } />
            <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                    <PageWrapper component={Profile} />
                </ProtectedRoute>
            } />

            {/* Restaurant Dashboard Routes */}
            <Route path="/restaurant/*" element={
                <RoleProtectedRoute allowedRoles={['restaurant_admin']}>
                    <DashboardLayout role="restaurant_admin" />
                </RoleProtectedRoute>
            }>
                <Route path="dashboard" element={<RestaurantDashboard />} />
                <Route path="menu" element={<RestaurantMenu />} />
                <Route path="orders" element={<RestaurantOrders />} />
                <Route path="stats" element={<RestaurantDashboard />} />
                <Route path="profile" element={<RestaurantProfile />} />
            </Route>

            {/* Delivery Dashboard Routes */}
            <Route path="/delivery/*" element={
                <RoleProtectedRoute allowedRoles={['delivery_partner']}>
                    <DashboardLayout role="delivery_partner" />
                </RoleProtectedRoute>
            }>
                <Route path="dashboard" element={<DeliveryDashboard />} />
                <Route path="orders" element={<DeliveryOrders />} />
                <Route path="earnings" element={<DeliveryEarnings />} />
                <Route path="history" element={<DeliveryHistory />} />
                <Route path="profile" element={<DeliveryProfile />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={
                <RoleProtectedRoute allowedRoles={['super_admin']}>
                    <DashboardLayout role="super_admin" />
                </RoleProtectedRoute>
            }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="restaurants" element={<AdminRestaurants />} />
                <Route path="delivery" element={<AdminDeliveryPartners />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="cms/hero" element={<CMSHeroEditor />} />
                <Route path="cms/categories" element={<CMSCategoryEditor />} />
                <Route path="cms/lanes" element={<CMSLaneEditor />} />
                <Route path="cms/offers" element={<CMSOfferEditor />} />
                <Route path="cms/footer" element={<CMSFooterEditor />} />
            </Route>

            {/* Static Pages */}
            <Route path="/about" element={<PageWrapper component={StaticPage} />} />
            <Route path="/careers" element={<PageWrapper component={StaticPage} />} />
            <Route path="/team" element={<PageWrapper component={StaticPage} />} />
            <Route path="/help" element={<PageWrapper component={StaticPage} />} />
            <Route path="/partner" element={<PageWrapper component={StaticPage} />} />
            <Route path="/ride" element={<PageWrapper component={StaticPage} />} />
            <Route path="/terms" element={<PageWrapper component={StaticPage} />} />
            <Route path="/refund" element={<PageWrapper component={StaticPage} />} />
            <Route path="/privacy" element={<PageWrapper component={StaticPage} />} />
            <Route path="/cookie" element={<PageWrapper component={StaticPage} />} />

            <Route path="*" element={<PageWrapper component={NotFound} />} />
        </Routes>
    );
};

export default AppRoutes;
