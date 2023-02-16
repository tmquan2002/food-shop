import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useRef, useState } from 'react';
import { Card, CardActions, CardMedia, CardContent, Button, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { homeSlice } from './homeSlices'
import { notiAndSwitchPageSlices } from './notiAndSwitchPageSlices';

export default function HomeList(props) {

    //First fetch and instantly store in ref, used for later
    const fullData = useRef([])
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
    const searchTerm = props.searchTerm
    const searchType = props.searchType === 'All' ? '' : props.searchType

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
            //Only fetch on first render
            if (renderCount === 0) {
                const response = await fetch(`${process.env.REACT_APP_MOCKAPI_1}/Product`)
                    .then((res) => res.json())
                    .catch((error) => { console.log(error) })
                fullData.current = response
                setRenderCount(x => x + 1)
            } else {
                // console.log(response)
                //Check sale, check search word and search types
                const data = (props.sale ? fullData.current.filter(e => e.sale) : fullData.current)
                    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())
                        && s.type.toLowerCase().includes(searchType.toLowerCase()))

                if (data.length === 0) { setSplitData([[]]) }
                else {
                    var arrays = []
                    //Round up
                    setTotalPages(Math.ceil(data.length / itemsPerPage))
                    while (data.length > 0) {
                        arrays.push(data.splice(0, itemsPerPage));
                    }
                    setSplitData(arrays)
                }
            }
            setRender(true)
        }
        fetchList()

    }, [renderCount, searchTerm, searchType])

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