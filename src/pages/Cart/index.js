import { Alert, Button, Dialog, DialogActions, DialogTitle, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartDetail from "../../components/cart/CartDetail";
import { homeSlice } from "../../components/home/homeSlices";
import MainNavbar from "../../components/Navbar";

export default function CartPage() {

    const [openSnack, setOpenSnack] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogMess, setDialogMess] = useState("")
    const user = useSelector((state) => state.loginUser.user)
    const cart = useSelector((state) => state.manageHome.cart)
    const productIds = cart.map(item => item.id)
    const productQuantities = cart.map(item => item.quantity)
    const totalPrice = cart.reduce((starter, product) => {
        return starter + Number(product.price) * Number(product.quantity);
    }, 0);
    const dispatch = useDispatch()

    async function checkout() {
        await fetch(`https://63bf8018e262345656ea4182.mockapi.io/mystore/v1/Order`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
            body: JSON.stringify({
                orderDate: Date.now(),
                userId: user.id,
                productIds: productIds,
                productQuantities: productQuantities,
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        // console.log(response)
    }

    const handleCheckout = () => {
        if (!user.login) {
            //Check login
            setDialogMess("Please login first to finish checkout!")
            setOpenDialog(true)
        } else if (user.role !== "USER") {
            //Check USER role
            setDialogMess("Only User allowed to buy the products")
            setOpenDialog(true)
            //Check Quantity in cart and quantity in store            
        } else {
            async function fetchList() {
                const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product`)
                    .then((res) => res.json())
                    .catch((error) => { console.log(error) })
                let quantityError = []
                cart.forEach(item => {
                    let storeQuantity = (response.find(obj => obj.id === item.id)).quantity;
                    if (storeQuantity < item.quantity) {
                        quantityError.push(item.name)
                    }
                })
                if (quantityError.length !== 0) {
                    setDialogMess("There's not enough " + quantityError.join(', ') + " in store. Please edit the quantity or remove the product, you can check the amount left in our store by viewing the detail")
                    setOpenDialog(true)
                } else {
                    //Empty cart and add the order to mockapi
                    checkout().then(() => dispatch(homeSlice.actions.emptyCart()))
                    setOpenSnack(true)
                }
            }
            fetchList()
        }
        //checkout()
    }

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
                        <Button fullWidth size="large" variant="contained" onClick={handleCheckout}>CHECKOUT</Button>
                    </div>
                </div>
            }
            <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)}>
                <Alert onClose={() => setOpenSnack(false)} severity="success" sx={{ width: '100%' }}>
                    Checkout successful!
                </Alert>
            </Snackbar>

            <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
                <DialogTitle>
                    {dialogMess}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}