import { Button, Divider } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { notiAndSwitchPageSlices } from "./notiAndSwitchPageSlices"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { homeSlice } from "./homeSlices";

//Detail of one chosen product
export default function Detail() {
    const dispatch = useDispatch()
    const product = useSelector((state) => state.manageHome.currentProduct)

    //Add to cart in redux store
    const handleBuy = (data) => {
        let temp = {
            id: data.id,
            name: data.name,
            type: data.type,
            quantity: 1,
            price: data.price,
            sale: data.sale,
            image: data.image
        }
        dispatch(homeSlice.actions.addToCart(temp))
        dispatch(notiAndSwitchPageSlices.actions.setMessageNotification("Product Added!"))
    }

    //Get current product in redux store and show to the user
    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <Button variant='outlined' onClick={() => {
                    dispatch(notiAndSwitchPageSlices.actions.switchPage('home'))
                }}><ArrowBackIosIcon />Back to Home page</Button>
            </div>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <img
                    width={'40%'}
                    height={400}
                    src={product.image}
                    alt={product.name}
                    style={{ objectFit: 'contain' }}
                    loading="lazy"
                />
                <div style={{ marginLeft: '10%', width: '30%' }}>
                    <div style={{ fontSize: '40px' }}>{product.name}</div>
                    <div>Type: {product.type}</div>
                    {product.quantity !== 0 ?
                        <h4>Amount: {product.quantity}</h4> : <></>
                    }
                    <Divider />
                    <br />
                    <div style={{ fontSize: '30px', color: '#d32f2f', fontWeight: '600', marginBottom: '5rem' }}>{product.price} VND</div>
                    {product.quantity === 0 ?
                        <Button disabled variant='contained' fullWidth>Sold out</Button>
                        :
                        <Button variant='contained' fullWidth onClick={() => handleBuy(product)}>Add to Cart</Button>
                    }

                </div>
            </div>
        </>
    )
}