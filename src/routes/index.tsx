import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layout/dashboard/Dashboard";
import React from "react";
import DasboardHome from "../pages/DasboardHome";
import Manage_Users from "../pages/Manage_Users";
import Love from "../pages/Love";
import Transactions from "../pages/Transactions";
import SettingsPage from "../pages/Settings";
import Notifications from "../pages/Notifications";
import Auth from './../layout/auth/Auth';
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import SetNewPassword from "../pages/SetNewPassword";
import Seller_Profile from "../pages/Seller_Profile";
import Settings_personalInformation from "../pages/Settings_personalInformation";
import SettingsFaq from "../pages/SettingsFaq";
import SettingsTermsAndConditions from "../pages/SettingsTermsAndConditions";
import EditTermsAndCondition from "../pages/EditTermsAndConditions";
import Questionaries from "../pages/Questionaries";
import Club from './../pages/Club';
import Volunteer from "../pages/Volunteer";
import Profile from "../pages/Profile";
import SeeSetupTrialMatch from "../pages/SeeSetupTrialMatch";
import FeedBack from "../pages/FeedBack";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/ErrorPage";
import Settings_AboutUs from "../pages/Settings_AboutUs";
import EditAboutus from "../pages/EditAboutUs";
import Subscriptions from "../pages/Subscriptions";



const handleNotifications = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("16++++++++++++++Notification clicked!");
    // Add your notification handling logic here
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard handleNotifications={handleNotifications} />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <AdminRoutes><DasboardHome /></AdminRoutes>,
            },
            {
                path: "/club",
                element: <AdminRoutes><Club /></AdminRoutes>,
            },
            {
                path: "/notifications",
                element: <AdminRoutes><Notifications /></AdminRoutes>,
            },
            {
                path: "/subscriptions",
                element: <AdminRoutes><Subscriptions /></AdminRoutes>,
            },
            {
                path: "/seeTrialMatch",
                element: <AdminRoutes><SeeSetupTrialMatch /></AdminRoutes>
            },
            {
                path: "/volunteer",
                element: <AdminRoutes><Volunteer /></AdminRoutes>
            },
            {
                path: "/manage-users",
                element: <AdminRoutes><Manage_Users /></AdminRoutes>,
            },
            {
                path: "/manage-users/seller-profile/:id",
                element: <AdminRoutes><Seller_Profile /></AdminRoutes>,
            },
            {
                path: "/love",
                element: <AdminRoutes><Love /></AdminRoutes>,
            },
            {
                path: "/transactions",
                element: <AdminRoutes><Transactions /></AdminRoutes>,
            },
            {
                path: "/questionaries",
                element:<AdminRoutes> <Questionaries /></AdminRoutes>
            },
            {
                path: "/feedback",
                element: <AdminRoutes><FeedBack /></AdminRoutes>
            },
            {
                path: "/settings",
                element: <AdminRoutes><SettingsPage /></AdminRoutes>,
            },
           
            {
                path: "/settings/personalInformation",
                element: <AdminRoutes><Settings_personalInformation /></AdminRoutes>,
            },
            {
                path: "/settings/faq",
                element: <AdminRoutes><SettingsFaq /></AdminRoutes>,
            },
            {
                path: "/settings/termsAndCondition",
                element: <AdminRoutes><SettingsTermsAndConditions /></AdminRoutes>
            },
            {
                path: "settings/termsAndCondition/edittermsAndConditions",
                element: <AdminRoutes><EditTermsAndCondition /></AdminRoutes>
            },
            {
                path: "profile",
                element:<AdminRoutes> <Profile /></AdminRoutes>
            },
        ]
    },
    {
        path: "/auth",
        element: <Auth />,
        children: [
          {
            path: "/auth",
            element: <Login />,
          },
          {
            path: "/auth/login",
            element: <Login />,
          },
          {
            path: "/auth/forget-password",
            element: <ForgetPassword />,
          },
          {
            path: "/auth/verify",
            element: <VerifyEmail />,
          },
          {
            path: "/auth/set-new-password",
            element: <SetNewPassword />,
          },
                 
        ],
      },
])

export default router;