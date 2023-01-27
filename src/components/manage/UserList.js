import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export default function UserList() {
    const [data, setData] = useState([])
    const [render, setRender] = useState(false)
    const [search, setSearch] = useState("")

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setSearch(e.target.value)
            setRender(false)
        }
    }

    useEffect(() => {
        async function fetchList() {
            const response = await fetch(`https://63b40c67ea89e3e3db54c338.mockapi.io/mystore/v1/User`)
                .then((res) => res.json())
                .catch((error) => { console.log(error) })
            const list = response
            console.log(response)
            setData(list.filter(e => e.name.toLowerCase().includes(search.toLowerCase())))
            setRender(true)
        }
        fetchList()
    }, [search])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}><strong>USER LIST</strong></div>
                <TextField sx={{ width: 500 }} label="Search name (Enter to search)" variant="outlined" onKeyDown={handleSearch} size="small" />
            </div>
            <TableContainer sx={{ maxHeight: 550 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell align="right"><strong>Role</strong></TableCell>
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
