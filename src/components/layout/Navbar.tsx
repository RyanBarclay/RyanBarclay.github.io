import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  alpha,
} from "@mui/material";
import { Menu as MenuIcon, DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import componentLinkInfo from "../../config/routes";
import { GLASS_BORDER } from "../../config/constants";
import ThemeButton from "../ui/ThemeButton";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/DarkModeContext";
import { Global } from "@emotion/react";
import { grey } from "@mui/material/colors";

const drawerBleeding = 56;

const Navbar = () => {
  const theme = useTheme();
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect scroll for styling changes
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const navItems = Object.entries(componentLinkInfo);

  // Mobile Layout: Top bar + Bottom navigation
  if (isMobile) {
    return (
      <>
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          }}
        />
        {/* Top Bar for Mobile - just branding and theme toggle */}
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
              <IconButton
                color="inherit"
                onClick={() => setMobileOpen(true)}
                sx={{
                  color: trigger ? "text.primary" : "common.white",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
        {/* Swipeable Drawer from Bottom */}
        <SwipeableDrawer
          anchor="bottom"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: alpha(
                  isDarkTheme
                    ? theme.palette.common.black
                    : theme.palette.common.white,
                  0.75,
                ),
                backdropFilter: "blur(20px) saturate(180%)",
              },
            },
          }}
        >
          <Paper
            sx={{
              backgroundColor: alpha(
                isDarkTheme
                  ? theme.palette.common.black
                  : theme.palette.common.white,
                0.75,
              ),
              backdropFilter: "blur(20px) saturate(180%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 1,
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              visibility: "visible",
              right: 0,
              left: 0,
              height: drawerBleeding,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 6,
                backgroundColor: alpha(
                  isDarkTheme
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                  isDarkTheme ? 0.5 : 0.6,
                ),
                borderRadius: 3,
              }}
            />
          </Paper>

          <List>
            {/* Theme Toggle as first item */}
            <ListItemButton
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
              }}
            >
              <ListItemText primary="Theme" />
              <ThemeButton
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
              />
            </ListItemButton>
            {navItems.map(([key, { to, label, icon }]) => (
              <ListItemButton
                key={key}
                onClick={() => {
                  navigate(to);
                  setMobileOpen(false);
                }}
                selected={location.pathname === to}
              >
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </SwipeableDrawer>
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
