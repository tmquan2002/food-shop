import HomeList from "../../components/home/HomeList"
import HomeSearchBar from "../../components/home/SearchBar"
import MainNavbar from "../../components/Navbar"

export default function HomePage() {
    return (
        <>
            <MainNavbar />
            <HomeSearchBar />
            <HomeList />
            <HomeList sale/>
        </>
    )
}