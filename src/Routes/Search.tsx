import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetShow } from "../api";
import { Banner, MediumTitle, Overview, Title, Wrapper } from "./TV";
import Slider from "./Slider";
import { Loader } from "./Home";
import { makeImagePath } from "../utills";

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data, isLoading } = useQuery<IGetShow>({
        queryKey: ["movie", "search"],
        queryFn: () => getSearchMovie(keyword as string),
    });
    const { data: tvData, isLoading: isTvLoading } = useQuery<IGetShow>({
        queryKey: ["tv", "search"],
        queryFn: () => getSearchTv(keyword as string),
    });
    return (
        <Wrapper>
            {isLoading || !data ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].name}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <MediumTitle>Search Result for Movies</MediumTitle>
                    {isLoading || !data ? (<Loader>Loading...</Loader>) : (
                        <Slider type="search" category="movie" data={data} />
                    )}
                    <MediumTitle>Search Result for TV</MediumTitle>
                    {isTvLoading || !tvData ? (<Loader>Loading...</Loader>) : (
                        <Slider type="search" category="tv" data={tvData} />
                    )}
                </>
            )}
        </Wrapper>
    );
}

export default Search;