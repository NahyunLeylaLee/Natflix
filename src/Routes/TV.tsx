import { useQuery } from "@tanstack/react-query";
import { makeImagePath } from "../utills";
import Slider from "./Slider";
import { getAiringToday, getTv, getTvPopular, getTvTopRated, IGetShow } from "../api";
import { Banner, Loader, MediumTitle, Overview, Title, Wrapper } from "./Home";

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
            bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}
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