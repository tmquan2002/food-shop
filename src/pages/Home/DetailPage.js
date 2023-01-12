import { Paper } from "@mui/material";
import Detail from "../../components/home/Detail";

export default function DetailPage() {
    return (
        <div className="main-home-detail-container">
            <Paper elevation={3} children={<Detail />} sx={{ padding: '3%' }} />
        </div>
    )
}