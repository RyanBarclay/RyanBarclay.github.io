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
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import componentLinkInfo from "../../config/routes";
import ThemeButton from "../ui/ThemeButton";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/DarkModeContext";
import { Global } from "@emotion/react";
import { grey } from "@mui/material/colors";

// TODO: Consider extracting repeated sx styles into styled components or theme styleOverrides
// MUI best practice: Large components with many inline sx props should use styled() API
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
        {/* TODO: Global styles should be in theme, not component-level */}
        {/* MUI best practice: Use theme.components.MuiDrawer.styleOverrides instead */}
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
          elevation={trigger ? 4 : 0}
          color="transparent"
          sx={{
            // TODO: Move these hardcoded rgba values to theme.palette.background or alpha helper
            // MUI best practice: Use theme.palette.mode and alpha() from @mui/material/styles
            backdropFilter: trigger ? "none" : "blur(20px) saturate(180%)",
            backgroundColor: trigger
              ? theme.palette.background.paper
              : "rgba(255, 255, 255, 0.08)",
            transition: theme.transitions.create(
              ["background-color", "backdrop-filter"],
              {
                duration: theme.transitions.duration.standard,
              },
            ),
            border: trigger ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
              {/* TODO: Consider using Typography component instead of Box for text content */}
              {/* MUI best practice: Use semantic components (Typography) over generic Box */}
              <Box
                sx={{
                  color: trigger ? "text.primary" : "common.white",
                  fontSize: "1.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                Ryan Barclay
              </Box>
              <Box>
                <ThemeButton
                  isDarkTheme={isDarkTheme}
                  toggleTheme={toggleTheme}
                />
                <IconButton
                  color="inherit"
                  onClick={() => setMobileOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
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
          PaperProps={{
            sx: {
              backdropFilter: "blur(20px) saturate(180%)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 3,
                }}
              />
            </Box>
            <List>
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
          </Box>
        </SwipeableDrawer>
      </>
    );
  }

  // Desktop Navigation
  return (
    <AppBar
      position="fixed"
      elevation={trigger ? 4 : 0}
      color="transparent"
      sx={{
        backdropFilter: trigger ? "none" : "blur(20px) saturate(180%)",
        backgroundColor: trigger
          ? theme.palette.background.paper
          : "rgba(255, 255, 255, 0.08)",
        borderRadius: trigger ? "24px 24px 24px 24px" : "0",
        transition: theme.transitions.create(
          ["background-color", "border-radius", "backdrop-filter"],
          {
            duration: theme.transitions.duration.standard,
          },
        ),
        border: trigger ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Left: Name */}
          <Box
            sx={{ flex: "0 0 200px", display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                color: trigger ? "text.primary" : "common.white",
                fontSize: "1.5rem",
                letterSpacing: "0.02em",
              }}
            >
              Ryan Barclay
            </Box>
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
              flex: "0 0 200px",
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
