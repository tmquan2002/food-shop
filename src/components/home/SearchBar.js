import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { homeSlice } from "./homeSlices";

export default function HomeSearchBar() {

    const dispatch = useDispatch()
    const [type, setType] = useState(useSelector((state) => state.manageHome.searchType))


    const handleChange = (e) => {
        setType(e.target.value);
        dispatch(homeSlice.actions.changeSearchType(e.target.value))
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            dispatch(homeSlice.actions.changeSearchValue(e.target.value))
        }
    }

    return (
        <div className='search-bar'>
            <TextField sx={{ width: 300 }} label="...Search" variant="outlined" onKeyDown={handleSearch} />
            <FormControl>
                <InputLabel>Type</InputLabel>
                <Select
                    value={type === '' ? 'All' : type}
                    label="Type"
                    onChange={handleChange}
                    autoWidth
                    sx={{ width: 150 }}
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Fruit">Fruit</MenuItem>
                    <MenuItem value="Rice">Rice</MenuItem>
                    <MenuItem value="Snack">Snack</MenuItem>
                    <MenuItem value="Milk">Milk</MenuItem>
                    <MenuItem value="Vegetables">Vegetables</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}