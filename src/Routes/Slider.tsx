import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getShowDetail, IGetShow, IShowDetail } from "../api";
import { makeImagePath } from "../utills";
import { Loader } from "./Home";

const SliderWrapper = styled.div`
  position: relative;
  height: 200px;
  margin-bottom: 50px;
  display: flex;
`;

const SlideButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  width: 50px;
`;

const SlideButton = styled.button`
  background-color: #252525;
  color: white;
  border: none;
  width: 25px;
  height: 100px;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background-color: #383838ff;
  }
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

const BoxButton = styled.button`
display: flex;
float: right;
margin: 10px; 
border: none; 
background-color: transparent; 
color: ${(props) => props.theme.white.lighter};
font-size: 25px;
cursor: pointer;
&:hover{
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
}
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(22, 22, 22);
  background: linear-gradient(to top, rgba(22, 22, 22), transparent);
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

const BigShow = styled(motion.div)`
position: absolute;
width: 50vw;
height: 70vh;
left: 0;
right: 0;
margin: 0 auto;
background: rgb(22, 22, 22);
// background-color: linear-gradient(40deg, rgb(22, 22, 22) 24.16%, rgba(6, 10, 23, 0) 56.61%), linear-gradient(0deg, rgb(22, 22, 22) 3.91%, rgba(6, 10, 23, 0) 69.26%);
border-radius: 15px;
overflow: hidden;
text-overflow: ellipsis;
box-shadow: rgba(0, 0, 0, 0.8) 0px 0.25rem 0.5rem 0px;
z-index: 10;
`;

const BigCover = styled.div`
background-size: cover;
background-position: center center;
width: 100%;
height: 400px;
display: flex;
flex-direction: column;
justify-content: space-between;
`;

const BigTitle = styled.h3`
color: ${(props) => props.theme.white.lighter};
margin: 0 20px;
font-size: 46px;
position: relative;
text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden; 
`;

const BigHeader = styled.span`
padding: 5px;
background-color: rgb(65, 65, 65);
color: ${(props) => props.theme.white.lighter};
border-radius: 5px;
`;

const BigOverview = styled.p`
text-overflow: ellipsis;
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 5;
margin: 20px 0 0 0;
padding-bottom: 2px;
position: relative;
color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
    hidden: (back: boolean) => ({
        x: back ? -window.innerWidth : window.innerWidth,
    }),
    visible: {
        x: 0,
    },
    exit: (back: boolean) => ({
        x: back ? window.innerWidth : -window.innerWidth,
    })
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

interface ISliderProps {
    type: "tv" | "movie" | "search";
    category: string;
    data: IGetShow;
}

function Slider({ type, category, data }: ISliderProps) {
    const navigate = useNavigate();
    const showPathMatch: PathMatch<string> | null = useMatch(`/${type}/${category}/:showId`);
    const showId = showPathMatch?.params.showId;
    const { data: detailData } = useQuery<IShowDetail>({
        queryKey: ["show", "detail", showId],
        queryFn: () => getShowDetail(type === 'search' ? category : type, Number(showId)),
        enabled: !!showId
    });
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const { scrollY } = useScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 105);
    const [back, setBack] = useState(false);
    const totalShows = data.results.length - 1;
    const maxIndex = Math.floor(totalShows / offset) - 1;
    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            setBack(false);
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const decreaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            setBack(true);
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (showId: number) => {
        navigate(`/${type}/${category}/${showId}`);
    };
    const onOverlayClick = () => {
        navigate(type === "movie" ? "/" : `/${type}`);
    };
    const clickedShow = showPathMatch?.params.showId && data?.results?.find((show) => String(show.id) === showPathMatch.params.showId);
    return (
        <>
            {data ? (
                <>
                    <SliderWrapper>
                        <SlideButtonWrapper>
                            <SlideButton onClick={decreaseIndex}>{"<"}</SlideButton>
                        </SlideButtonWrapper>
                        <div style={{ position: 'relative', width: 'calc(100% - 100px)' }}>
                            <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={back}>
                                <Row
                                    custom={back}
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
                                        .map((show) => {
                                            return (
                                                <Box
                                                    layoutId={`${category}-${show.id}`}
                                                    variants={boxVariants}
                                                    whileHover="hover"
                                                    initial="normal"
                                                    transition={{ type: "tween" }}
                                                    key={`${category}-${show.id}`}
                                                    $bgPhoto={makeImagePath(show.backdrop_path, "w500")}
                                                    onClick={() => onBoxClicked(show.id)}
                                                >
                                                    <Info variants={infoVariants}>
                                                        <h4>{show.title ?? show.name}</h4>
                                                    </Info>
                                                </Box>
                                            )
                                        })}
                                </Row>
                            </AnimatePresence>
                        </div>
                        <SlideButtonWrapper>
                            <SlideButton onClick={incraseIndex}>{">"}</SlideButton>
                        </SlideButtonWrapper>
                    </SliderWrapper>
                    <AnimatePresence>
                        {showPathMatch ? (
                            <>
                                <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }}></Overlay>
                                <BigShow
                                    layoutId={`${category}-${showPathMatch.params.showId}`}
                                    style={{ top: setScrollY }}
                                >
                                    {clickedShow && detailData && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, rgba(22, 22, 22), transparent), url(${makeImagePath(
                                                        clickedShow.backdrop_path,
                                                        "w1280"
                                                    )})`
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "end" }}>
                                                    <BoxButton onClick={onOverlayClick}>✕</BoxButton>
                                                </div>
                                                <BigTitle>{clickedShow?.title ?? clickedShow?.name}</BigTitle>
                                            </BigCover>
                                            <div style={{ padding: "30px", background: "linear-gradient(to bottom, rgba(22, 22, 22), transparent)" }}>
                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    {detailData.genres?.map(({ id, name }: any) => <BigHeader key={id}>{name}</BigHeader>)}
                                                </div>
                                                <BigOverview>{clickedShow.overview}</BigOverview>
                                            </div>
                                        </>
                                    )}
                                </BigShow>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            ) : (<Loader>Loading...</Loader>)}
        </>
    );
}

export default Slider;