import { Button, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notiAndSwitchPageSlices } from "../home/notiAndSwitchPageSlices";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CartItem from "./CartItem";

export default function CartDetail() {
    const cart = useSelector((state) => state.manageHome.cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleBackToHome = () => {
        dispatch(notiAndSwitchPageSlices.actions.switchPage('home'))
        navigate("/")
    }

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Typography variant="h5">Your cart is empty!</Typography>
                <Button variant='text' size="large" onClick={handleBackToHome}><ArrowBackIosIcon />Back to Home page</Button>
            </div>
        )
    } else {
        return (
            <div style={{ padding: '1rem' }}>
                <Grid container spacing={2} justifyContent='space-between'>
                    {cart.map((info) => (
                        <CartItem product={info} key={info.id} />
                    ))}
                </Grid>
            </div>
        )
    }
}