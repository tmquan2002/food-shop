import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notiAndSwitchPageSlices } from "../../components/home/notiAndSwitchPageSlices";
import MainNavbar from "../../components/Navbar"
import DetailPage from "./DetailPage";
import HomePage from "./HomePage";

function Feature(props) {
    const feature = props.feature;
    if (feature === "home") {
        return <HomePage />;
    } else if (feature === "detail") {
        return <DetailPage />
    }
}

export default function HomeMainPage() {
    const productSelector = useSelector((state) => state.manageSwitchNoti)
    const dispatch = useDispatch()
    return (
        <>
            <MainNavbar />
            <Feature feature={productSelector.pageState} />
            <Snackbar
                open={productSelector.notification.open} autoHideDuration={3000}
                onClose={() => dispatch(notiAndSwitchPageSlices.actions.closeMessageNotification())}
            >
                <Alert onClose={() => dispatch(notiAndSwitchPageSlices.actions.closeMessageNotification())}
                    severity="success" sx={{ width: '100%' }}>
                    {productSelector.notification.message}
                </Alert>
            </Snackbar>
        </>
    )
}