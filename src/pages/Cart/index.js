import { Alert, Button, Dialog, DialogActions, DialogTitle, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartDetail from "../../components/cart/CartDetail";
import { homeSlice } from "../../components/home/homeSlices";
import MainNavbar from "../../components/Navbar";

export default function CartPage() {

    //Alert
    const [openSnack, setOpenSnack] = useState(false)
    //Alert message
    const [snackMess, setSnackMess] = useState('')
    //Confirm delete or show message when checkout
    const [openDialog, setOpenDialog] = useState(false)
    //For loading the cart
    const [loading, setLoading] = useState(false)
    //Show message
    const [dialogMess, setDialogMess] = useState("")
    //Open dialog based on action (checkout and remove)
    const [action, setAction] = useState('checkout')
    const user = useSelector((state) => state.loginUser.user)
    const cart = useSelector((state) => state.manageHome.cart)
    //All products in cart
    const productIds = cart.map(item => item.id)
    const productQuantities = cart.map(item => item.quantity)
    const totalPrice = cart.reduce((starter, product) => {
        return starter + Number(product.price) * Number(product.quantity);
    }, 0);
    const dispatch = useDispatch()

    //Add order to mockapi when checkout successful
    async function checkout() {
        await fetch(`https://63bf8018e262345656ea4182.mockapi.io/mystore/v1/Order`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
            body: JSON.stringify({
                //Date.now(): get current date, store in millisecond
                orderDate: Date.now(),
                userId: user.id,
                productIds: productIds,
                productQuantities: productQuantities,
                total: totalPrice.toString()
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        // console.log(response)
    }

    //Update quantity onBlur
    async function updateQuantity(data) {
        await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product/${data.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'PUT',
            body: JSON.stringify({
                quantity: Number(data.quantity),
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        // console.log(response)
    }

    //Actions done before checkout
    const handleCheckout = () => {
        setAction('checkout')
        setLoading(true)
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
                //Don't checkout if the quantity is bigger than in app store
                if (quantityError.length !== 0) {
                    setDialogMess("There's not enough " + quantityError.join(', ') + " in store. Please edit the quantity or remove the product, you can check the amount left in our store by viewing the detail")
                    setOpenDialog(true)
                } else {
                    //Empty cart, add the order to mockapi and update quantity in store
                    checkout()
                    cart.forEach(item => {
                        let storeQuantity = (response.find(obj => obj.id === item.id)).quantity;
                        let data = {
                            id: item.id,
                            quantity: storeQuantity - item.quantity
                        }
                        updateQuantity(data)
                    })
                    dispatch(homeSlice.actions.emptyCart())
                    setOpenSnack(true)
                    setSnackMess('Checkout successful!')
                }
            }
            fetchList()
        }
    }

    //Confirm before remove all product in cart
    const handleRemoveCart = () => {
        setAction('remove')
        setOpenDialog(true)
        setDialogMess("Remove your cart?")
    }

    //Remove confirmed
    const confirmRemoved = () => {
        dispatch(homeSlice.actions.emptyCart())
        setOpenSnack(true)
        setSnackMess('Cart removed!')
        setOpenDialog(false)
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
                        {!loading ?
                            <>
                                <Button fullWidth size="large" variant="contained" onClick={handleCheckout}>CHECKOUT</Button>
                                <Button fullWidth size="large" onClick={handleRemoveCart}>REMOVE CART</Button>
                            </>
                            :
                            <>
                                <Button fullWidth size="large" variant="contained" disabled>CHECKOUT</Button>
                                <Button fullWidth size="large" disabled>REMOVE CART</Button>
                            </>
                        }
                    </div>
                </div>
            }
            <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => {
                setOpenSnack(false)
                setLoading(false)
            }}>
                <Alert onClose={() => {
                    setOpenSnack(false)
                    setLoading(false)
                }}
                    severity="success" sx={{ width: '100%' }}>
                    {snackMess}
                </Alert>
            </Snackbar>

            <Dialog onClose={() => {
                setOpenDialog(false)
                setLoading(false)
            }}
                open={openDialog}>
                <DialogTitle>
                    {dialogMess}
                </DialogTitle>
                <DialogActions>
                    {action === 'checkout' ?
                        <Button onClick={() => {
                            setOpenDialog(false)
                            setLoading(false)
                        }}>OK</Button>
                        :
                        <>
                            <Button onClick={() => { setOpenDialog(false) }}>
                                CANCEL
                            </Button>
                            <Button color='error' onClick={confirmRemoved} autoFocus>
                                REMOVE
                            </Button>
                        </>
                    }
                </DialogActions>
            </Dialog>
        </>
    )
}