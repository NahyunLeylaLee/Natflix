import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetShow } from "../api";
import Slider from "./Slider";
import { Loader, Banner, MediumTitle, Overview, Title, Wrapper } from "./Home";
import { makeImagePath } from "../utills";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import styled from "styled-components";

const NoResults = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
  useEffect(() => {
    console.log('data = ', data);
    console.log(data && tvData)
  }, [data]);

  useEffect(() => {
    console.log('tvData = ', tvData);
  }, [tvData])
  return (
    <Wrapper>
      <Helmet>
        <title>
          Search
        </title>
      </Helmet>
      {isLoading || !data || !tvData ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {data.total_results !== 0 && tvData.total_results !== 0 && (
            <>
              <Banner
                bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}
              >
                <Title>{data?.results[0].name}</Title>
                <Overview>{data?.results[0].overview}</Overview>
              </Banner>
              <MediumTitle>Search Results for {keyword} of Movies</MediumTitle>
              {isLoading || !data ? (<Loader>Loading...</Loader>) : (
                <Slider type="search" category="movie" data={data} />
              )}
              <MediumTitle>Search Results for {keyword} of TV Shows</MediumTitle>
              {isTvLoading || !tvData ? (<Loader>Loading...</Loader>) : (
                <Slider type="search" category="tv" data={tvData} />
              )}
            </>
          )}
          <NoResults>
            <MediumTitle>No Results of {keyword}</MediumTitle>
          </NoResults>
        </>
      )}
    </Wrapper>
  );
}

export default Search;