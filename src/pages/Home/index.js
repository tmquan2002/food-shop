import HomeList from "../../components/home/HomeList"
import MainNavbar from "../../components/Navbar"

export default function HomePage() {
    return (
        <>
            <MainNavbar />
            <HomeList />
            <HomeList sale/>
        </>
    )
}