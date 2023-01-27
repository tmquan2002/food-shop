import { useDispatch } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

export default function AddProduct() {
    const dispatch = useDispatch()
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg')
    const [publicId, setPublicId] = useState('')
    const [imageError, setImageError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = e => {
        var files = e.target.files;
        var filesArray = [].slice.call(files);
        console.log(filesArray[0])
        if (filesArray[0] !== undefined) {
            if (filesArray[0].size >= 10485760) {
                setImageError(true)
            } else {
                setImageError(false)
                setFile(filesArray[0])
                setLoading(true)
                uploadImage(filesArray[0])
                if (publicId !== '') {
                    removeImage(publicId)
                }
            }
        }
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
        console.log(data)
        setImageUrl(data.url)
        setPublicId(data.public_id)
        setLoading(false)
    };

    const removeImage = async (public_Id) => {
        // console.log(public_Id)
        const timestamp = Math.floor(new Date().getTime() / 1000)
        const string = `public_id=${public_Id}&timestamp=${timestamp}jLbWAhxfoILaqRYrGfIERFydbi0`
        const sha1 = require('js-sha1');
        const signature = sha1(string)

        const formData = new FormData();
        formData.append('public_id', public_Id);
        formData.append('signature', signature);
        formData.append('api_key', `412722435262794`);
        formData.append('timestamp', timestamp);
        await fetch(`https://api.cloudinary.com/v1_1/tmquan/image/destroy`, {
            method: 'POST',
            body: formData
        }).then(r => r.json());
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'Fruit',
            quantity: 0,
            price: 1000,
            sale: true,
        },
        onSubmit: (values, { resetForm }) => {
            fetchAdd(values)
            dispatch(productSlice.actions.setMessageNotification('New product added!'))
            resetForm()
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required.").min(2, "Must be 2 characters or more").max(20, "Keep the length under 20 characters"),
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
                <br />
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
                <div>
                    {!loading ?
                        <div style={{ textAlign: 'center', height: '100%', padding: '3%', borderStyle: 'dashed', borderColor: '#FFC5B3' }}>
                            {file !== null ?
                                <>
                                    {imageError ?
                                        <Typography color='red'>File too large! Please upload image under 10MB</Typography>
                                        :
                                        <img
                                            src={URL.createObjectURL(file)}
                                            style={{ width: '100%', height: 300, objectFit: 'contain' }}
                                            alt="preview"
                                        />
                                    }
                                </>
                                :
                                <Typography>Click Browse.. to upload image. Try to keep the image with 1:1 ratio</Typography>
                            }
                            <Button variant="contained" component="label">
                                Browse...
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={e => handleChange(e)}
                                />
                            </Button>
                        </div>
                        :
                        <Button variant="contained" disabled component="label">
                            Loading...
                        </Button>
                    }
                </div>
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