import { useSelector, useDispatch } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';
import { Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function UpdateProduct() {
    const product = useSelector((state) => state.manageProduct.currentProduct)
    const dispatch = useDispatch()
    async function fetchUpdate(data) {
        await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product/${product.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'PUT',
            body: JSON.stringify({
                name: data.name,
                type: data.type,
                quantity: data.quantity,
                price: data.price,
                sale: data.sale,
                img: '',
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        // console.log(response)
    }

    const formik = useFormik({
        initialValues: {
            name: product.name,
            type: product.type,
            quantity: product.quantity,
            price: product.price,
            sale: product.sale,
            image: product.image,
        },
        onSubmit: () => {
            fetchUpdate(formik.values)
            dispatch(productSlice.actions.setMessageNotification('Product updated!'))
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required.").min(2, "Must be 2 characters or more"),
            type: Yup.string().required("Type is required."),
            quantity: Yup.number().integer().required("Quantity is required.").typeError("Please enter a valid number").max(300, "No more than 300").min(0, "Must be a positive number"),
            price: Yup.number().integer().required("Price is required.").typeError("Please enter a valid number").min(1000, "Most food products are more than 1000 VND"),
        }),
        validateOnChange: false,
        validateOnBlur: false,
    });

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Button variant='contained' onClick={() => {
                    dispatch(productSlice.actions.switchView())
                }}><ArrowBackIosIcon />Back to list view</Button>
            </div>
            <h1>EDIT PRODUCT</h1>
            <form onSubmit={formik.handleSubmit}>

                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    style={{ marginTop: '20px' }}
                />
                {formik.errors.name && (<Typography variant="caption" color="red">{formik.errors.name}</Typography>)}
                <TextField
                    fullWidth
                    label="Type"
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    style={{ marginTop: '20px' }}
                />
                {formik.errors.type && (<Typography variant="caption" color="red">{formik.errors.type}</Typography>)}
                <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    style={{ marginTop: '20px' }}
                />
                {formik.errors.quantity && (<Typography variant="caption" color="red">{formik.errors.quantity}</Typography>)}
                <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    style={{ marginTop: '20px' }}
                />
                {formik.errors.price && (<Typography variant="caption" color="red">{formik.errors.price}</Typography>)}
                <div>
                    <FormControlLabel control={<Switch checked={formik.values.sale}/>}
                        label="Sale" name='sale' onClick={formik.handleChange} />
                </div>
                <div>
                    <Button
                        type='submit'
                        variant="contained"
                        endIcon={<SendIcon />}
                    >
                        Update
                    </Button>
                </div>
            </form>
        </>
    )
}