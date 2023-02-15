import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { Card, CardActions, CardMedia, CardContent, Button, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { homeSlice } from './homeSlices'
import { notiAndSwitchPageSlices } from './notiAndSwitchPageSlices';

export default function HomeList(props) {

    //Numbers of product show in 1 page
    const itemsPerPage = 4
    //Each nested array will have n itemsPerPage above
    const [splitData, setSplitData] = useState([[]])
    //Total pages
    const [totalPages, setTotalPages] = useState(1)
    //Current page
    const [page, setPage] = useState(1);
    const [render, setRender] = useState(false)
    const [renderCount, setRenderCount] = useState(0)
    const dispatch = useDispatch()
    const searchValue = useSelector((state) => state.manageHome.searchValue)
    const searchType = useSelector((state) => state.manageHome.searchType)

    const handleDetail = (data) => {
        dispatch(homeSlice.actions.viewCurrentProduct(data))
        dispatch(notiAndSwitchPageSlices.actions.switchPage("detail"))
    }

    //Add to cart in redux store
    const handleBuy = (data) => {
        //Default quantity is 1
        let temp = {
            id: data.id,
            name: data.name,
            type: data.type,
            quantity: 1,
            price: data.price,
            sale: data.sale,
            image: data.image
        }
        dispatch(homeSlice.actions.addToCart(temp))
        dispatch(notiAndSwitchPageSlices.actions.setMessageNotification("Product Added!"))
    }

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`${process.env.REACT_APP_MOCKAPI_1}/Product`)
                .then((res) => res.json())
                .catch((error) => { console.log(error) })

            console.log(response)
            //Check sale, check search word and search types
            if (response !== undefined) {
                const data = (props.sale ? response.filter(e => e.sale) : response)
                    .filter(s => s.name.toLowerCase().includes(searchValue.toLowerCase())
                        && s.type.toLowerCase().includes(searchType.toLowerCase()))

                var arrays = []
                //Round up
                setTotalPages(Math.ceil(data.length / itemsPerPage))
                if (data.length <= itemsPerPage) {
                    arrays.push(data.splice(0, data.length))
                } else {
                    while (data.length > 0) {
                        arrays.push(data.splice(0, itemsPerPage));
                    }
                }
                if (arrays.length === 0) {
                    setSplitData([[]])
                } else {
                    setSplitData(arrays)
                }
                setRender(true)
            }
        }
        fetchList()

    }, [renderCount, searchValue, searchType])

    return (
        <div className='main-list'>
            {!props.sale ? <Typography style={{ fontSize: '1rem' }} color='primary'><b>ALL PRODUCTS</b></Typography>
                : <Typography style={{ fontSize: '1rem' }} color='primary'><b>PRODUCTS ON SALE</b></Typography>}
            {render ? <Stack spacing={2}>
                <div className="data-list-container">
                    {/* Prevent undefined list */}
                    {splitData[page - 1]?.map((v) => (
                        <div className="card-data" key={v.id}>
                            <Card sx={{ width: 200, height: 300 }}>
                                <CardMedia
                                    component="img"
                                    alt={v.name}
                                    height="140"
                                    image={v.image}
                                    sx={{ objectFit: "contain" }}
                                />
                                <CardContent>
                                    <Typography gutterBottom component="div">
                                        {v.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {v.price} VND
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color='inherit' onClick={() => handleDetail(v)}><b>More Detail</b></Button>
                                    {v.quantity === 0 ? <Button disabled size="small"><b>Sold Out</b></Button>
                                        : <Button size="small" color='secondary' onClick={() => handleBuy(v)}><b>ADD TO CART</b></Button>}
                                </CardActions>
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="data-list-container">
                    <Pagination color='primary' count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
                </div>
            </Stack> :
                <div className='data-list-container'>
                    {[...Array(4).keys()].map((item) => (
                        <div className="card-data" key={item}>
                            <Card sx={{ width: 200, height: 300 }}>
                                <Skeleton variant="rounded" width={500} height={300} />
                            </Card>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}