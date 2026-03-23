import { Box, Container, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/DarkModeContext";
import { KeyboardArrowDown, ArrowForward } from "@mui/icons-material";
import { NAVBAR_HEIGHT, NAVBAR_HEIGHT_WITH_PADDING } from "../../config/constants";

const HERO_POSTER = "/assets/images/hero-poster.jpg";

const HERO_SLIDES = [
  {
    title: "Software Engineer",
    subtitle:
      "Building partner integrations, full-stack systems, and AI workflows — from concept to deployment.",
  },
  {
    title: "Full Stack Developer",
    subtitle:
      "React frontends, Node backends, DevOps pipelines — and the glue that holds it all together.",
  },
  {
    title: "Agentic Coordinator",
    subtitle:
      "Designing multi-agent AI workflows that turn days of work into hours. Velocity is the product.",
  },
  {
    title: "Forward Deployed\nSoftware Engineer",
    subtitle:
      "Embedded at the intersection of engineering and GTM. I close the gap between what's possible and what ships.",
  },
];

const SLIDE_INTERVAL = 4000;
const FADE_DURATION = 400;

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const { isDarkTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
        setVisible(true);
      }, FADE_DURATION);
      return () => clearTimeout(timeout);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: `-${NAVBAR_HEIGHT_WITH_PADDING}px`,
        paddingTop: `${NAVBAR_HEIGHT}px`,
      }}
    >
      {/* Video Background with Parallax */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120%", // Slightly taller for parallax movement
          transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
          willChange: "transform",
          zIndex: 0,
        }}
      >
        {/* Poster image shown until video is ready */}
        <Box
          component="img"
          src={HERO_POSTER}
          alt=""
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: videoLoaded ? 0 : 1,
            transition: (theme) =>
              theme.transitions.create("opacity", {
                duration: theme.transitions.duration.slow,
                easing: theme.transitions.easing.easeInOut,
              }),
            pointerEvents: "none",
          }}
        />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source
            src="https://videos.pexels.com/video-files/33323673/14190586_2560_1440_24fps.mp4"
            type="video/mp4"
          />
        </video>
      </Box>

      {/* Dark Overlay for Text Readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: (theme) => theme.palette.overlay.hero,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          animation: "fadeInUp 0.8s ease-out 0.3s both",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: "GreatForest, sans-serif",
              fontWeight: 400,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              mb: 2,
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
              whiteSpace: "pre-line",
            }}
          >
            {HERO_SLIDES[activeIndex].title}
          </Typography>
          <Box sx={{ width: 60, height: 3, bgcolor: "primary.main", mx: "auto", my: 2 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              maxWidth: "800px",
              mx: "auto",
              mb: 4,
              textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            {HERO_SLIDES[activeIndex].subtitle}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/projects")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              boxShadow: (theme) => theme.shadows[4],
              "&:hover": {
                boxShadow: (theme) => theme.shadows[5],
              },
            }}
          >
            View Projects
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/about")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              color: "white",
              borderColor: "rgba(255,255,255,0.7)",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            About Me
          </Button>
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: (theme) => theme.spacing(4),
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          animation: "bounce 2s infinite",
          "@keyframes bounce": {
            "0%, 100%": {
              transform: "translateX(-50%) translateY(0)",
            },
            "50%": {
              transform: "translateX(-50%) translateY(10px)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
            opacity: 0.8,
            cursor: "pointer",
          }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <KeyboardArrowDown sx={{ fontSize: 40 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
