import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetShow } from "../api";
import Slider from "./Slider";
import { Loader, Banner, MediumTitle, Overview, Title, Wrapper } from "./Home";
import { makeImagePath } from "../utills";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetShow>({
    queryKey: [keyword],
    queryFn: () => getSearchMovie(keyword as string),
  });
  const { data: tvData, isLoading: isTvLoading } = useQuery<IGetShow>({
    queryKey: [keyword],
    queryFn: () => getSearchTv(keyword as string),
  });
  return (
    <Wrapper>
      {isLoading || !data ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <MediumTitle>Search Results of {keyword} for Movies</MediumTitle>
          {isLoading || !data ? (<Loader>Loading...</Loader>) : (
            <Slider type="search" category="movie" data={data} />
          )}
          <MediumTitle>Search Results of {keyword} for TV Shows</MediumTitle>
          {isTvLoading || !tvData ? (<Loader>Loading...</Loader>) : (
            <Slider type="search" category="tv" data={tvData} />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;