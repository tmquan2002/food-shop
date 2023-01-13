import { Button, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { productSlice } from '../manage/productSlices'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductList() {
    // const product = useSelector((state) => state.manageProduct.currentProduct)
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [render, setRender] = useState(false)
    const [renderCounter, setRenderCounter] = useState(0)
    const [search, setSearch] = useState("")
    // const [openAlert, setOpenAlert] = useState(false)
    const skeleton = [1, 2, 3, 4, 5]

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setSearch(e.target.value)
            setRender(false)
            setRenderCounter(s => s + 1)
        }
    }

    // async function deleteProduct() {
    //     await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product/${product.id}`, { method: 'DELETE' })
    //         .then((res) => res.json())
    //         .catch((error) => { console.log(error) })
    //     dispatch(productSlice.actions.setMessageNotification("Delete successful!"))
    //     setOpenAlert(false)
    //     setRenderCounter(s => s + 1)
    //     setRender(false)
    // }

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product`)
                .then((res) => res.json())
                .catch((error) => { console.log(error) })
            const list = response
            setData(list.filter(e => e.name.toLowerCase().includes(search.toLowerCase())))
            setRender(true)
        }
        fetchList()
    }, [search, renderCounter])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}><strong>PRODUCT LIST</strong></div>
                <Button variant="contained" onClick={() => { dispatch(productSlice.actions.switchAdd()) }}><AddIcon />New Product</Button>
            </div>
            <TextField fullWidth label="Search name (Enter to search)" variant="outlined" onKeyDown={handleSearch} size='small' />
            <TableContainer sx={{ maxHeight: 550 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Sale</strong></TableCell>
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
                                {skeleton.map((info) => (
                                    <TableRow
                                        key={info}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={20} height={15} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={50} height={15} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={50} height={15} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={50} height={15} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={50} height={15} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Skeleton variant="rounded" width={50} height={15} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="update" color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="update" color="error">
                                                <DeleteIcon />
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
