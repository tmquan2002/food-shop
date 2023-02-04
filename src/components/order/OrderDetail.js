import { Grid, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";

export default function OrderDetail(props) {

    //en-za format: YYYY/MM/DD
    //Date is stored in millisecond
    const date = props.skeleton ? "skeleton" : (new Date(props.data.orderDate)).toLocaleDateString("en-za")
    const [render, setRender] = useState(false)
    const [data, setData] = useState([])
    //List of product Ids the current user have in 1 order
    const productIds = props.skeleton ? [] : props.data.productIds
    //List of product quantities Ids the current user have in 1 order, the order is the same as product Ids
    const productQuantities = props.skeleton ? [] : props.data.productQuantities

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`${process.env.REACT_APP_MOCKAPI_1}/Product`)
                .then((res) => res.json())
                .catch((error) => { console.log(error) })
            const list = response
            //Filter list of all products using orderProductIds as reference
            const filterList = list.filter(function (item) {
                //Each items on the list if not found in order product Ids will return -1
                //Remove this product in the list this case
                return productIds.indexOf(item.id) !== -1;
            });
            for (let i = 0; i < filterList.length; i++) {
                filterList[i].quantity = productQuantities[i]
            }
            setData(filterList)
            setRender(true)
        }
        if (!props.skeleton) {
            fetchList()
        }
    }, [productIds, productQuantities])

    return (
        <div style={{ padding: '2rem' }}>
            {render ?
                <>
                    <h3 style={{ marginBottom: '1rem' }}>Order Date: {date}</h3>
                    <Grid container spacing={2} justifyContent='space-between'>
                        {data.map((info) => (
                            <OrderItem product={info} key={info.id} />
                        ))}
                    </Grid>
                    <h3 style={{ fontWeight: 600, textAlign: 'right', color: 'red' }}>Total: {props.data.total} VND</h3>
                </>
                :
                <>
                    <h3 style={{ marginBottom: '1rem' }}><Skeleton width={210} height={40} /></h3>
                    <Grid container spacing={2} justifyContent='space-between'>
                        {[...Array(2).keys()].map((key) => (
                            <OrderItem skeleton key={key} />
                        ))}
                    </Grid>
                </>
            }
        </div>
    )
}