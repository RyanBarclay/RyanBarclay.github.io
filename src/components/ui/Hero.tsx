import { Box, Container, Typography, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/DarkModeContext";
import { KeyboardArrowDown, ArrowForward } from "@mui/icons-material";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const { isDarkTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        marginTop: "-64px",
        paddingTop: "64px",
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
          transform: `translateY(${scrollY * 0.5}px)`, // Parallax effect
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1735508729860-c9a4752585eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicml0aXNoJTIwY29sdW1iaWElMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY5MTk4MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
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
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
            mb: 2,
            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Full-Stack Developer
        </Typography>
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
          Building scalable applications and intelligent systems—from concept to
          deployment
        </Typography>

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
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
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
          bottom: 32,
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
