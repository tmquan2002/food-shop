import { useDispatch } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AddProduct() {
    const dispatch = useDispatch()
    async function fetchAdd(data) {
        await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
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
            name: '',
            type: '',
            quantity: 0,
            price: 0,
            sale: true,
            image: '',
        },
        onSubmit: () => {
            fetchAdd(formik.values)
            dispatch(productSlice.actions.setMessageNotification('New product added!'))
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required.").min(2, "Must be 2 characters or more"),
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
            <h1>ADD NEW PRODUCTS</h1>
            <form onSubmit={formik.handleSubmit}>

                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                />
                {formik.errors.name && (<Typography variant="caption" color="red">{formik.errors.name}</Typography>)}
                <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select
                        label="Type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        autoWidth
                        style={{ width: 200 }}
                    >
                        <MenuItem value="Fruit">Fruit</MenuItem>
                        <MenuItem value="Snack">Snack</MenuItem>
                        <MenuItem value="Milk">Milk</MenuItem>
                        <MenuItem value="Vegetables">Vegetables</MenuItem>
                    </Select>
                </FormControl>
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
                    <FormControlLabel control={<Switch />} label="Sale" name='sale'
                        value={formik.values.sale} onClick={formik.handleChange} />
                </div>
                <div>
                    <Button
                        type='submit'
                        variant="contained"
                        endIcon={<SendIcon />}
                    >
                        Add
                    </Button>
                </div>
            </form>
        </>
    )
}