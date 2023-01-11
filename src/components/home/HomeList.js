import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { Card, CardActions, CardMedia, CardContent, Button } from '@mui/material';

export default function HomeList(props) {

    const itemsPerPage = 6
    const [splitData, setSplitData] = useState([[]])
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1);
    const [render, setRender] = useState(false)
    const [renderCount, setRenderCount] = useState(0)

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/Product`)
                .then((res) => res.json())
                .catch((error) => { console.log(error) })
            //
            const data = props.sale ? response.filter(e => e.sale) : response
            var arrays = []
            setTotalPages(Math.ceil(data.length / itemsPerPage))
            if (data.length <= itemsPerPage) {
                arrays.push(data.splice(0, data.length))
            } else {
                while (data.length > 0) {
                    arrays.push(data.splice(0, itemsPerPage));
                }
            }
            setSplitData(arrays)
            setRender(true)
        }
        fetchList()

    }, [renderCount])

    return (
        <div className='main-list'>
            {!props.sale ? <Typography style={{ fontSize: '1rem' }} color='primary'><strong>ALL PRODUCTS</strong></Typography>
                : <Typography style={{ fontSize: '1rem' }} color='primary'><strong>PRODUCTS ON SALE</strong></Typography>}
            {render ? <Stack spacing={2}>
                <div className="data-list-container">
                    {splitData[page - 1].map((v) => (
                        <div className="card-data" key={v.id}>
                            <Card sx={{ width: 200, maxHeight: 300 }}>
                                <CardMedia
                                    component="img"
                                    alt={v.name}
                                    height="140"
                                    image={v.image}
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
                                    <Button size="small" color='inherit' onClick={() => { }}><strong>More Detail</strong></Button>
                                    {v.quantity === '0' ? <Button disabled size="small"><strong>Sold Out</strong></Button>
                                        : <Button size="small" color='secondary' onClick={() => { }}><strong>Buy</strong></Button>}
                                </CardActions>
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="data-list-container">
                    <Pagination color='primary' count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
                </div>
            </Stack> : <></>
            }
        </div>
    );
}