import { CircularProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MainNavbar from "../../components/Navbar";
import OrderDetail from "../../components/order/OrderDetail";

export default function Orders() {
    const user = useSelector((state) => state.loginUser.user)
    const [data, setData] = useState([])
    const [render, setRender] = useState(false)

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`https://63bf8018e262345656ea4182.mockapi.io/mystore/v1/Order`)
                .then((res) => res.json())
                .catch((error) => { console.log(error) })
            console.log(response)
            // Only get the orders current login user have
            setData(response.filter(e => e.userId === user.id))
            setRender(true)
        }
        fetchList()
    }, [])

    if (user.login && user.role === "USER") {
        return (
            <>
                <MainNavbar />
                <div style={{ marginTop: '5rem', textAlign: 'center', fontSize: '35px', fontWeight: 600 }}>YOUR ORDERS</div>
                {render ? <>
                    {data.map((info) => (
                        <div className="order" key={info.id}>
                            <Paper elevation={3} children={<OrderDetail data={info} />} />
                        </div>
                    ))}
                </> :
                    <div className="order">
                        <CircularProgress color="inherit" />
                    </div>
                }
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