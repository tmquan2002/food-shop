import { Button, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import CartDetail from "../../components/cart/CartDetail";
import MainNavbar from "../../components/Navbar";

export default function CartPage() {

    const cart = useSelector((state) => state.manageHome.cart)
    const totalPrice = cart.reduce((starter, product) => {
        return starter + Number(product.price) * Number(product.quantity);
    }, 0);

    return (
        <>
            <MainNavbar />
            <div className="main-cart-container">
                <Paper elevation={3} children={<CartDetail />} sx={{ padding: '3%' }} />
            </div>
            {cart.length === 0 ?
                <></> :
                <div className="checkout" style={{ position: 'relative', height: 'auto' }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <div style={{ fontSize: '30px', color: '#d32f2f', fontWeight: '600' }}>Total: {totalPrice} VND</div>
                        <Button fullWidth size="large" variant="contained">CHECKOUT</Button>
                    </div>
                </div>
            }
        </>
    )
}