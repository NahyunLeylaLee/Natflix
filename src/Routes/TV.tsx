import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { makeImagePath } from "../utills";
import Slider from "./Slider";
import { getAiringToday, getTv, getTvPopular, getTvTopRated, IGetShow } from "../api";

export const Wrapper = styled.div`
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

export const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
`;

export const MediumTitle = styled(Title)`
font-size: 30px;
margin-left: 20px;
`;

export const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function TV() {
    const { data, isLoading } = useQuery<IGetShow>({
            queryKey: ["tv", "onAir"],
            queryFn: getTv
        });
        const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery<IGetShow>({
            queryKey: ["tv", "topRated"],
            queryFn: getTvTopRated,
        });
        const { data: popularData, isLoading: isPopularLoading } = useQuery<IGetShow>({
            queryKey: ["tv", "popular"],
            queryFn: getTvPopular
        });
        const { data: airTodayData, isLoading: isAirTodayLoading } = useQuery<IGetShow>({
            queryKey: ["tv", "airingToday"],
            queryFn: getAiringToday,
        });
    return (
        <Wrapper>
            {isLoading || !data ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        // onClick={incraseIndex}
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].name}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <MediumTitle>On the Air</MediumTitle>
                    <Slider type="tv" category="on-the-air" data={data} />
                    <MediumTitle>Top Rated</MediumTitle>
                    {isTopRatedLoading || !topRatedData ? (<Loader>Loading...</Loader>) : (
                        <Slider type="tv" category="top-rated" data={topRatedData} />
                    )}
                    <MediumTitle>Popular</MediumTitle>
                    {isPopularLoading || !popularData ? (<Loader>Loading...</Loader>) : (
                        <Slider type="tv" category="popular" data={popularData} />
                    )}
                    <MediumTitle>Airing Today</MediumTitle>
                    {isAirTodayLoading || !airTodayData ? (<Loader>Loading...</Loader>) : (
                        <Slider type="tv" category="airing-today" data={airTodayData} />
                    )}
                </>
            )}
        </Wrapper>
    );
}

export default TV;