import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Grid, TextField } from "@mui/material"
import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { homeSlice } from "../home/homeSlices"

export default function CartItem(props) {
    const [quantity, setQuantity] = useState(props.product.quantity)
    const [openAlert, setOpenAlert] = useState(false)
    const oldQuantity = useRef(0)
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setQuantity(e.target.value)
    }

    const handleBlur = () => {
        if (quantity <= 0 || quantity === "") {
            setQuantity(oldQuantity.current)
        } else {
            oldQuantity.current = quantity
            const payload = {
                id: props.product.id,
                quantity: quantity
            }
            dispatch(homeSlice.actions.changeQuantity(payload))
        }
    }

    return (
        <>
            <Grid xs={1} md={1} lg={1}>
                <img alt={props.product.name} src={props.product.image} width={100} height={100} />
            </Grid>
            <Grid xs={6} md={8} lg={8}>
                <div style={{fontWeight: 600, fontSize: '25px'}}>{props.product.name}</div>
                <div style={{fontWeight: 200, color: 'red'}}>{props.product.price} VND</div>
            </Grid>
            <Grid xs={2} md={1} lg={2} style={{ textAlign: 'right' }}>
                <TextField type="number" name="quantity" label="Quantity" value={quantity} onChange={handleChange} size="small" onBlur={handleBlur} sx={{ width: 80 }} />
                <div style={{fontWeight: 600}}>{Number(props.product.price) * Number(props.product.quantity)} VND</div>
                <Button onClick={() => setOpenAlert(true)}>remove</Button>
            </Grid>
            <Grid xs={12} md={12}>
                <Divider sx={{margin: '1rem'}}/>
            </Grid>
            <Dialog
                open={openAlert}
                onClose={() => setOpenAlert(false)}
            >
                <DialogContent>
                    <DialogContentText>
                        Remove this product from you cart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAlert(false)}>Cancel</Button>
                    <Button color='error' onClick={() => dispatch(homeSlice.actions.removeFromCart(props.product))} autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}