import { useDispatch } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

export default function AddProduct() {
    const dispatch = useDispatch()
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = e => {
        var files = e.target.files;
        var filesArray = [].slice.call(files);
        // console.log(filesArray)
        setFile(filesArray[0])
        setLoading(true)
        uploadImage(filesArray[0])
    };

    async function fetchAdd(data) {
        await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'POST',
            body: JSON.stringify({
                name: data.name,
                type: data.type,
                quantity: Number(data.quantity),
                price: data.price,
                sale: data.sale,
                image: imageUrl,
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        // console.log(response)
    }

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file)
        formData.append('upload_preset', `blooddonorpreset`);
        const data = await fetch(`https://api.cloudinary.com/v1_1/tmquan/image/upload`, {
            method: 'POST',
            body: formData
        }).then(r => r.json());
        setImageUrl(data.url)
        // setCurrPublicId(data.public_id)
        setLoading(false)
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'Fruit',
            quantity: 0,
            price: 1000,
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
                    style={{ marginTop: '20px' }}
                />
                {formik.errors.name && (<Typography variant="caption" color="red" style={{ marginBottom: '2' }}>{formik.errors.name}</Typography>)}
                <br/>
                <FormControl style={{ marginTop: '20px' }}>
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
                        <MenuItem value="Rice">Rice</MenuItem>
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
                <Stack direction="row" alignItems="center" spacing={2}>
                    {!loading ?
                        <>
                            <Button variant="contained" component="label">
                                Upload
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={e => handleChange(e)}
                                />
                            </Button>
                            <div>{file !== null ? <>{file.name}</> : <></>}</div>
                        </>
                        :
                        <Button variant="contained" disabled component="label">
                            Loading...
                        </Button>
                    }
                </Stack>
                <div style={{ marginTop: '1rem' }}>
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