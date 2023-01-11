import { TextField } from "@mui/material";

export default function HomeSearchBar() {
    return (
        <div className='search-bar'>
            <TextField sx={{ width: 500 }} label="...Search" variant="outlined"  size="small" />
        </div>
    )
}