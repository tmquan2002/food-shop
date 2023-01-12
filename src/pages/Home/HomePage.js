import HomeList from "../../components/home/HomeList";
import HomeSearchBar from "../../components/home/SearchBar";

export default function HomePage() {
    return (
        <>
            <HomeSearchBar />
            <HomeList />
            <HomeList sale />
        </>
    )
}