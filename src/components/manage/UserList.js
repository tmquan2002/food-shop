import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function UserList() {
    //Only fetch in first render, store entire data in fullData ref
    const fullData = useRef([])
    const [data, setData] = useState([])
    const [render, setRender] = useState(false)
    const [renderCount, setRenderCount] = useState(0)
    const [search, setSearch] = useState("")

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setRender(false)
        setRenderCount(x => x + 1)
    }

    useEffect(() => {
        async function fetchList() {
            if (renderCount === 0) {
                const response = await fetch(`${process.env.REACT_APP_MOCKAPI_1}/User`)
                    .then((res) => res.json())
                    .catch((error) => { console.log(error) })
                const list = response
                // console.log(response)
                fullData.current = list
                setData(list.filter(e => e.name.toLowerCase().includes(search.toLowerCase())))
            } else {
                setData(fullData.current.filter(e => e.name.toLowerCase().includes(search.toLowerCase())))
            }
            setRender(true)
        }
        fetchList()
    }, [search, renderCount])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}><b>USER LIST</b></div>
                <TextField sx={{ width: 500 }} label="Search name" variant="outlined" onChange={handleSearch} size="small" />
            </div>
            <TableContainer sx={{ maxHeight: 550 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Email</b></TableCell>
                            <TableCell align="right"><b>Role</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {render ?
                            <>
                                {data?.map((info) => (
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
                                            {info.email}
                                        </TableCell>
                                        <TableCell align="right">
                                            {info.role}
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
                                        {[...Array(3).keys()].map((subKey) => (
                                            <TableCell component="th" scope="row" key={subKey}>
                                                <Skeleton variant="rounded" width={50} height={15} />
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">
                                            <Skeleton variant="rounded" height={15} align="right" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
