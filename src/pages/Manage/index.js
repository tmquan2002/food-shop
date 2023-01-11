import MainNavbar from "../../components/Navbar";
import AdminTabs from "../../components/manage/AdminTabs";
import { Paper } from "@mui/material";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

export default function Manage() {
    const user = useSelector((state) => state.loginUser.user)
    if (user.login && user.role === "ADMIN") {
        return (
            <>
                <MainNavbar />
                <div className="main-dashboard-container">
                    <Paper elevation={3} children={<AdminTabs />} />
                </div>
            </>
        )
    } else {
        return (
            <>
                <Navigate to="/login" />
            </>
        )
    }
}