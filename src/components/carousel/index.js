import React from "react";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Container,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
// And react-slick as our Carousel Lib
import Slider from "react-slick";

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function CaptionCarousel(props) {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  const { medias = [] } = props;
  // This list contains all the data for carousels
  // This can be static or loaded from a server
  return (
    <Box
      position={"relative"}
      height={props.height || "440px"}
      width={props.width || "440px"}
      overflow={"hidden"}
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      margin="0 auto"
    >
      {/* Left Icon */}
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform={"translate(-50%, -50%)"}
        zIndex={2}
        onClick={() => slider?.slickPrev()}
      >
        <ArrowBackIcon size="40px" />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform={"translate(50%, -50%)"}
        zIndex={2}
        onClick={() => slider?.slickNext()}
      >
        <ArrowForwardIcon size="40px" />
      </IconButton>
      {/* Slider */}
      <Slider
        autoplay={false}
        {...settings}
        ref={(slider) => setSlider(slider)}
      >
        {medias.map((media, index) => (
          <Box
            key={index}
            // height={'6xl'}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundImage={`url(${media.url ? media.url : media.src})`}
          >
            {/* This is the block you need to change, to customize the caption */}
            <Container
              padding="0"
              size="container.lg"
              height={props.height || "440px"}
              position="relative"
            >
              <Stack
                padding="0"
                w={"full"}
                position="absolute"
                bottom="0"
                background="#00000094"
              >
                {/* <Heading padding="1" textAlign="center" color="white" fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}>
                  {card.title}
                </Heading>
                <Text margin="0" padding="0" fontSize={{ base: 'md', lg: 'lg' }} color="GrayText">
                  {card.text}
                </Text> */}
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
