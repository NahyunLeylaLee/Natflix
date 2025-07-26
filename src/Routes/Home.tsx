import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, getPopular, getTopRated, getUpcoming, IGetShow } from "../api";
import { makeImagePath } from "../utills";
import Slider from "./Slider";
import { breakpoints } from "../media";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

export const Wrapper = styled.div`
  height: fit-content;
  width: 100vw;
  background: black;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
    ${breakpoints.sm} {
    height: 50vh;
  }  
  
  ${breakpoints.md} {
    height: 70vh;
  }

  ${breakpoints.lg} {
    height: 80vh;
  }
`;

export const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
  ${breakpoints.sm} {
    font-size: 25px;
    width: 80vw;
    margin: 20px 0;
  }
  
  ${breakpoints.md} {
    font-size: 30px;
  }

  ${breakpoints.lg} {
    font-size: 40px;
  }
`;

export const MediumTitle = styled(Title)`
  font-size: 30px;
  margin-left: 20px;
`;

export const Overview = styled.p`
  font-size: 35px;
  width: 80%;
  ${breakpoints.sm} {
    font-size: 15px;
    width: 80vw;
  }  
  ${breakpoints.md} {
    font-size: 20px;
    width: 80%;
  }
  ${breakpoints.lg} {
    font-size: 25px;
    width: 80%;
  }
`;

function Home() {
  const { data, isLoading } = useQuery<IGetShow>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies
  });
  const { data: popularData, isLoading: isPopularLoading } = useQuery<IGetShow>({
    queryKey: ["movies", "latest"],
    queryFn: getPopular
  });
  const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery<IGetShow>({
    queryKey: ["movies", "topRated"],
    queryFn: getTopRated,
  });
  const { data: upcomingData, isLoading: isUpcomingLoading } = useQuery<IGetShow>({
    queryKey: ["movies", "upcoming"],
    queryFn: getUpcoming,
  });
  return (
    <Wrapper>
      <Helmet>
        <title>
          Home
        </title>
      </Helmet>
      {isLoading || !data ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <MediumTitle>Now Playing</MediumTitle>
          <Slider type="movie" category="now-playing" data={data} />
          <MediumTitle>Top Rated</MediumTitle>
          {isTopRatedLoading || !topRatedData ? (<Loader>Loading...</Loader>) : (
            <Slider type="movie" category="top-rated" data={topRatedData} />
          )}
          <MediumTitle>Popular</MediumTitle>
          {isPopularLoading || !popularData ? (<Loader>Loading...</Loader>) : (
            <Slider type="movie" category="popular" data={popularData} />
          )}
          <MediumTitle>Upcoming</MediumTitle>
          {isUpcomingLoading || !upcomingData ? (<Loader>Loading...</Loader>) : (
            <Slider type="movie" category="upcoming" data={upcomingData} />
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Home;