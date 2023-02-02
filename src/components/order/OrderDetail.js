import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";

export default function OrderDetail(props) {

    //en-za format: YYYY/MM/DD
    //Date is stored in millisecond
    const date = (new Date(props.data.orderDate)).toLocaleDateString("en-za")
    const [render, setRender] = useState(false)
    const [data, setData] = useState([])
    const productIds = props.data.productIds
    const productQuantities = props.data.productQuantities

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product`)
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
        fetchList()
    }, [productIds, productQuantities])

    return (
        <>
            {render ?
                <div style={{ padding: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Order Date: {date}</h3>
                    <Grid container spacing={2} justifyContent='space-between'>
                        {data.map((info) => (
                            <OrderItem product={info} key={info.id} />
                        ))}
                    </Grid>
                    <h3 style={{ fontWeight: 600, textAlign: 'right', color: 'red' }}>Total: {props.data.total} VND</h3>
                </div>
                : <></>
            }
        </>
    )
}