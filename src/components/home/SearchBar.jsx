import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { homeSlice } from "./homeSlices";

export default function HomeSearchBar(props) {

    const dispatch = useDispatch()

    //Change search type on store
    const handleChangeType = (e) => {
        props.handleTypeChange(e.target.value)
    }

    //Change only when press Enter
    const handleChangeSearchTerm = (e) => {
        props.handleSearchChange(e.target.value)
    }

    return (
        <div className='search-bar'>
            <TextField sx={{ width: 300 }} label="...Search" variant="outlined" onChange={handleChangeSearchTerm} />
            <FormControl>
                <InputLabel>Type</InputLabel>
                <Select
                    value={props.searchType === '' ? 'All' : props.searchType}
                    label="Type"
                    onChange={handleChangeType}
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