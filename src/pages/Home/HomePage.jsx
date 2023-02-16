import { useState } from "react";
import HomeList from "../../components/home/HomeList";
import HomeSearchBar from "../../components/home/SearchBar";

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [type, setType] = useState('')
    const handleSearchChange = (value) => {
        setSearchTerm(value)
    }
    const handleTypeChange = (value) => {
        setType(value)
    }
    return (
        <>
            <HomeSearchBar handleSearchChange={handleSearchChange} handleTypeChange={handleTypeChange} searchType={type}/>
            <HomeList searchTerm={searchTerm} searchType={type}/>
            <HomeList sale searchTerm={searchTerm} searchType={type}/>
        </>
    )
}