import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, getPopular, getTopRated, getUpcoming, IGetShow } from "../api";
import { makeImagePath } from "../utills";
import Slider from "./Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 50px;
  overflow-x: hidden;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
`;

const MediumTitle = styled(Title)`
font-size: 30px;
margin-left: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
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
            {isLoading || !data ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
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
                        <Slider type="movie" category="popular" data={upcomingData} />
                    )}
                </>
            )}
        </Wrapper>
    );
}
export default Home;