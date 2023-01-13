import { Divider, Grid } from "@mui/material"

export default function OrderItem(props) {

    return (
        <>
            <Grid item xs={1} md={1} lg={1}>
                <img alt={props.product.name} src={props.product.image} width={70} height={70} />
            </Grid>
            <Grid item xs={6} md={8} lg={8}>
                <div style={{fontWeight: 600, fontSize: '25px'}}>{props.product.name}</div>
                <div style={{fontSize: 12, color: 'grey'}}>Amount: {props.product.quantity}</div>
                <div style={{fontWeight: 200, color: 'red'}}>{props.product.price} VND</div>
            </Grid>
            <Grid item xs={2} md={2} lg={2} style={{ textAlign: 'right' }}>
                <div style={{fontWeight: 600}}>{Number(props.product.price) * Number(props.product.quantity)} VND</div>
            </Grid>
            <Grid item xs={12} md={12}>
                <Divider sx={{margin: '1rem'}}/>
            </Grid>
        </>
    )
}