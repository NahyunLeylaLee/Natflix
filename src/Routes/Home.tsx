import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { useState } from "react";
import { makeImagePath } from "../utills";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Loader = styled.div`
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
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
position: fixed;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
opacity: 0;
`;

const BigMovie = styled(motion.div)`
position: absolute;
width: 40vw;
height: 80vh;
left: 0;
right: 0;
margin: 0 auto;
background-color: ${(props) => props.theme.black.lighter};
border-radius: 15px;
overflow: hidden;
`;

const BigCover = styled.div`
background-size: cover;
background-position: center center;
width: 100%;
height: 400px;
`;

const BigTitle = styled.h3`
color: ${(props) => props.theme.white.lighter};
padding: 20px;
font-size: 46px;
position: relative;
top: -80px;
`;

const BigOverview = styled.p`
padding: 20px;
position: relative;
color: ${(props) => props.theme.white.lighter};
top: -80px;
`;

const rowVariants = {
    hidden: {
        x: window.innerWidth - 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.innerWidth + 5,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            type: "tween",
            delay: 0.5,
            duration: 0.3,
        }
    }
} as const;

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
} as const;

const offset = 6;

function Home() {
    const navigate = useNavigate();
    const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
    const { scrollY } = useScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 65);
    const { data, isLoading } = useQuery<IGetMoviesResult>({
        queryKey: ["movies", "nowPlaying"],
        queryFn: getMovies
    }
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const onOverlayClick = () => navigate(-1);
    const clickedMovie = moviePathMatch?.params.movieId && data?.results.find(movie => String(movie.id) === moviePathMatch.params.movieId);
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        onClick={incraseIndex}
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map((movie) => (
                                        <Box
                                            layoutId={String(movie.id)}
                                            variants={boxVariants}
                                            whileHover="hover"
                                            initial="normal"
                                            transition={{ type: "tween" }}
                                            key={movie.id}
                                            $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                            onClick={() => onBoxClicked(movie.id)}
                                        >
                                            {/* Info는 Box에 있는 whileHover="hover" 같은게 이미 들어가 있다, 자식이라서 */}
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {moviePathMatch ? (
                            <>
                                <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }}></Overlay>
                                <BigMovie
                                    layoutId={moviePathMatch.params.movieId}
                                    style={{ top: setScrollY }}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie.backdrop_path,
                                                        "w500"
                                                    )})`
                                                }}
                                            />
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}
export default Home;