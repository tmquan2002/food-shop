import MainNavbar from "../../components/Navbar";
import AdminTabs from "../../components/manage/AdminTabs";
import { Paper } from "@mui/material";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

export default function Manage() {
    const login = useSelector((state) => state.loginUser.user.login)
    if (login) {
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