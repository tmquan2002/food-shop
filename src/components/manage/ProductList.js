import { Button, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductList() {
    const dispatch = useDispatch()
    const fullData = useRef([])
    const [data, setData] = useState([])
    const [render, setRender] = useState(false)
    const [renderCounter, setRenderCounter] = useState(0)
    const [search, setSearch] = useState("")
    // const [openAlert, setOpenAlert] = useState(false)

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setRender(false)
        setRenderCounter(s => s + 1)
    }

    // async function deleteProduct() {
    //     await fetch(`${process.env.REACT_APP_MOCKAPI_1}/Product/${product.id}`, { method: 'DELETE' })
    //         .then((res) => res.json())
    //         .catch((error) => { console.log(error) })
    //     dispatch(productSlice.actions.setMessageNotification("Delete successful!"))
    //     setOpenAlert(false)
    //     setRenderCounter(s => s + 1)
    //     setRender(false)
    // }

    useEffect(() => {
        async function fetchList() {
            if (renderCounter === 0) {
                const response = await fetch(`${process.env.REACT_APP_MOCKAPI_1}/Product`)
                    .then((res) => res.json())
                    .catch((error) => { console.log(error) })
                const list = response
                fullData.current = list
                setData(list.filter(e => e.name.toLowerCase().includes(search.toLowerCase())))
            } else {
                setData(fullData.current.filter(e => e.name.toLowerCase().includes(search.toLowerCase())))
            }
            setRender(true)
        }
        fetchList()
    }, [search, renderCounter])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}><b>PRODUCT LIST</b></div>
                <Button variant="contained" onClick={() => { dispatch(productSlice.actions.switchAdd()) }}><AddIcon />New Product</Button>
            </div>
            <TextField fullWidth label="Search name" variant="outlined" onChange={handleSearch} size='small' />
            <TableContainer sx={{ maxHeight: 550 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Type</b></TableCell>
                            <TableCell><b>Quantity</b></TableCell>
                            <TableCell><b>Price</b></TableCell>
                            <TableCell><b>Sale</b></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {render ?
                            <>
                                {data.map((info) => (
                                    <TableRow
                                        key={info.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {info.id}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {info.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {info.type}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {info.quantity}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {info.price} VND
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {info.sale ? 'Yes' : 'No'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="update" color="primary"
                                                onClick={() => dispatch(productSlice.actions.switchUpdate(info))}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {/* <IconButton aria-label="delete" color="error"
                                                onClick={() => {
                                                    setOpenAlert(true)
                                                    dispatch(productSlice.actions.updateCurrentProduct(info))
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                            :
                            <>
                                {[...Array(5).keys()].map((key) => (
                                    <TableRow
                                        key={key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={20} height={15} />
                                        </TableCell>
                                        {[...Array(5).keys()].map((subKey) => (
                                            <TableCell component="th" scope="row" key={subKey}>
                                                <Skeleton variant="rounded" width={50} height={15} />
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">
                                            <IconButton aria-label="update" color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Dialog
                open={openAlert}
                onClose={() => setOpenAlert(false)}
            >
                <DialogTitle>
                    Are you sure?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you really want to remove this product? This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAlert(false)}>Cancel</Button>
                    <Button color='error' onClick={deleteProduct} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    )
}
