import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import componentLinkInfo from "../../config/routes";
import { GLASS_BORDER } from "../../config/constants";
import ThemeButton from "../ui/ThemeButton";
import { ThemeContext } from "../../contexts/DarkModeContext";
import CompassNav from "./CompassNav";

const Navbar = () => {
  const theme = useTheme();
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  // Detect scroll for styling changes
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const navItems = Object.entries(componentLinkInfo);

  // Mobile: top bar (brand + hamburger fallback menu) + bottom compass.
  // No theme toggle on mobile — the theme follows the system preference
  // (prefers-color-scheme) by default.
  if (isMobile) {
    return (
      <>
        <AppBar
          position="fixed"
          elevation={trigger ? 2 : 0}
          color="transparent"
          sx={{
            backdropFilter: trigger ? "blur(20px) saturate(180%)" : "none",
            backgroundColor: trigger
              ? alpha(theme.palette.background.paper, 0.85)
              : "transparent",
            transition: theme.transitions.create(
              ["background-color", "backdrop-filter"],
              {
                duration: theme.transitions.duration.standard,
              },
            ),
            border: trigger ? "none" : GLASS_BORDER,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              disableGutters
              sx={{ justifyContent: "space-between", py: 2 }}
            >
              <Typography
                variant="h4"
                onClick={() => navigate("/")}
                sx={{
                  color: trigger ? "text.primary" : "common.white",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  fontFamily: "GreatForest, sans-serif",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                Ryan Barclay
              </Typography>
              {/* The hamburger is a discovery point, not a second menu:
                  it sweeps every option through the compass so the user
                  sees it's a horizontal scrubber. */}
              <IconButton
                color="inherit"
                aria-label="Show navigation options"
                onClick={() =>
                  window.dispatchEvent(new Event("compass:sweep"))
                }
                sx={{
                  color: trigger ? "text.primary" : "common.white",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
        <CompassNav />
      </>
    );
  }

  // Desktop Navigation
  return (
    <AppBar
      position="fixed"
      elevation={trigger ? 2 : 0}
      color="transparent"
      sx={{
        backdropFilter: trigger ? "blur(20px) saturate(180%)" : "none",
        backgroundColor: trigger
          ? alpha(theme.palette.background.paper, 0.85)
          : "transparent",
        borderRadius: trigger ? "24px 24px 24px 24px" : "0",
        transition: theme.transitions.create(
          ["background-color", "border-radius", "backdrop-filter"],
          {
            duration: theme.transitions.duration.standard,
          },
        ),
        border: trigger ? "none" : GLASS_BORDER,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            width: "100%",
            py: 2,
          }}
        >
          {/* Left: Name */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              onClick={() => navigate("/")}
              sx={{
                color: trigger ? "text.primary" : "common.white",
                cursor: "pointer",
                letterSpacing: "0.02em",
                fontFamily: "GreatForest, sans-serif",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              Ryan Barclay
            </Typography>
          </Box>

          {/* Center: Navigation links */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              gap: 1,
              justifyContent: "center",
            }}
          >
            {navItems.map(([key, { to, label }]) => (
              <Button
                key={key}
                onClick={() => navigate(to)}
                sx={{
                  color: trigger ? "text.primary" : "common.white",
                  fontWeight: location.pathname === to ? 700 : 400,
                  fontSize: "1.1rem",
                  borderBottom:
                    location.pathname === to
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                  borderRadius: 0,
                  px: 2,
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Right: Theme toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ThemeButton isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
