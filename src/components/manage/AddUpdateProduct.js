import { useSelector, useDispatch } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

export default function AddUpdateProduct() {
    //Get current product for Update
    const product = useSelector((state) => state.manageProduct.currentProduct)

    //Get current feature (Add or Update)
    const feature = useSelector((state) => state.manageProduct.feature)
    const dispatch = useDispatch()

    //File used to preview image before used to upload to Cloudinary
    //If file is null (user didn't browse any picture for the first time), no cloudinary action needed
    const [file, setFile] = useState(null)

    //For Add, no image selected so it should be null
    //For Update, null when no image available other than that get current url
    //No Image selected or
    const [imageUrl, setImageUrl] = useState(product.image === 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg' ? '' : product.image)

    //Cloudinary public_Id is the image ID, used for remove image in cloudinary media library
    const [publicId, setPublicId] = useState('')

    //For Update feature
    //In Cloudinary, public_Id is also contains in the last string of the imageURL with extension like .svg .png .jpg (split by "/")
    //Split imageURL with "/" and ".", then get the 2nd last item of splitted array to remove the extension
    const oldPublicId = product.image.split(/[/.]/)[product.image.split(/[/.]/).length - 2]

    //True when upload size is bigger than 10MB
    const [imageError, setImageError] = useState(false)

    //Loading the dialog/popup when image is being loaded to cloudinary
    const [loading, setLoading] = useState(false)

    //Open/Close dialog/popup
    const [openAlert, setOpenAlert] = useState(false)

    //Change image preview whenever user upload a new image
    const handleChange = e => {
        var files = e.target.files;
        var filesArray = [].slice.call(files);
        // console.log(filesArray[0])
        if (filesArray[0] !== undefined) {
            if (filesArray[0].size >= 10485760) {
                setImageError(true)
            } else {
                setImageError(false)
                setFile(filesArray[0])
            }
        }
    }

    //Add new product to mockapi
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
                image: imageUrl === '' ? 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg' : imageUrl,
            })
        })
            .then((res) => res.json())
            .catch((error) => { console.log(error) })
        // console.log(response)
    }

    //Update current product to mockapi
    async function fetchUpdate(data) {
        await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product/${product.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, method: 'PUT',
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

    //Upload to cloudinary media library
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
    }

    //Remove from cloudinary media library
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

    //MANAGE DIALOG
    //Run whenever submit the form. Action buttons should only appear when loading to cloudinary is completed
    const confirm = () => {
        setOpenAlert(true)
        if (file !== null) {
            setLoading(true)
            uploadImage(file)
        }
    }

    //Cancel action button
    const cancel = () => {
        if (file !== null) {
            removeImage(publicId)
        }
        setOpenAlert(false)
    }

    //Manage form with Formik
    const formik = useFormik({
        initialValues: {
            name: product.name,
            type: product.type,
            quantity: product.quantity,
            price: product.price,
            sale: product.sale,
        },
        onSubmit: (values, { resetForm }) => {
            if (feature === "add") {
                fetchAdd(values)
                dispatch(productSlice.actions.setMessageNotification('New product added!'))
                resetForm()
            }
            if (feature === "update") {
                fetchUpdate(formik.values)
                if (file !== null) {
                    removeImage(oldPublicId)
                }
                dispatch(productSlice.actions.setMessageNotification('Product updated!'))
                dispatch(productSlice.actions.switchView())
            }
            setOpenAlert(false)
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required.").min(2, "Must be 2 characters or more").max(20, "Keep the length under 20 characters"),
            quantity: Yup.number().integer().required("Quantity is required.").typeError("Please enter a valid number").max(300, "No more than 300").min(0, "Must be a positive number"),
            price: Yup.number().integer().required("Price is required.").typeError("Please enter a valid number").min(1000, "Most food products are more than 1000 VND"),
        }),
        validateOnChange: false,
        validateOnBlur: false,
    })

    //Validate action before submit
    const check = () => {
        console.log(formik.errors)
        if (formik.errors.length <= 0) {
            cancel()
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Button variant='contained' onClick={() => {
                    dispatch(productSlice.actions.switchView())
                }}><ArrowBackIosIcon />Back to list view</Button>
            </div>
            {feature === 'add' ? <h1>ADD NEW PRODUCTS</h1> :
                <h1>EDIT PRODUCT</h1>
            }
            <form id='productForm' onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    style={{ marginTop: '20px' }}
                />
                {formik.errors.name && (<Typography variant="caption" color="red">{formik.errors.name}</Typography>)}
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
                    <FormControlLabel control={<Switch checked={formik.values.sale} />}
                        label="Sale" name='sale' onClick={formik.handleChange} />
                </div>
                <div style={{ textAlign: 'center', height: '100%', padding: '3%', borderStyle: 'dashed', borderColor: '#FFC5B3' }}>
                    {imageError ?
                        <Typography color='red'>File too large! Please upload image under 10MB</Typography>
                        :
                        <>
                            {file !== null ?
                                <img
                                    src={URL.createObjectURL(file)}
                                    style={{ width: '100%', height: 300, objectFit: 'contain' }}
                                    alt="preview"
                                />
                                :
                                <>
                                    {imageUrl === '' ? <Typography>Click Browse.. to upload image. Keep the image in 1:1 ratio for better display</Typography>
                                        :
                                        <img
                                            src={imageUrl}
                                            style={{ width: '100%', height: 300, objectFit: 'contain' }}
                                            alt="preview"
                                        />
                                    }
                                </>
                            }
                        </>
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

                <div style={{ marginTop: '1rem' }}>
                    <Button variant="contained" endIcon={<SendIcon />}
                        onClick={confirm}>
                        {feature === 'add' ? 'Add' : 'Update'}
                    </Button>
                </div>

                {/* Popup */}
                <Dialog
                    open={openAlert}
                    onClose={cancel}
                >
                    <DialogTitle>
                        {feature === 'add' ? 'Add' : 'Update'} this product?
                    </DialogTitle>
                    {loading ?
                        <DialogContent>
                            <DialogContentText>
                                Please wait for a bit, the image is being loaded to the server
                            </DialogContentText>
                        </DialogContent> :
                        <></>
                    }
                    {!loading ?
                        <DialogActions>
                            <Button onClick={cancel}>Cancel</Button>
                            <Button color='error' type='submit' form='productForm' onClick={check}>
                                {feature === 'add' ? 'Add' : 'Update'}
                            </Button>
                        </DialogActions>
                        :
                        <DialogActions>
                            <Button color='error' disabled>
                                <CircularProgress />
                            </Button>
                        </DialogActions>
                    }
                </Dialog>
            </form>
        </>
    )
}