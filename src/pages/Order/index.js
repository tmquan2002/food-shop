import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MainNavbar from "../../components/Navbar";

export default function Orders() {
    const user = useSelector((state) => state.loginUser.user)
    if (user.login && user.role === "ADMIN") {
        return (
            <>
                <MainNavbar />
                <div className="main-dashboard-container">
                    {/* <Paper elevation={3} children={<AdminTabs />} /> */}
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