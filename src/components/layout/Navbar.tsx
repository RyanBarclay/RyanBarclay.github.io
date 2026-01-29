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

/**
 * ISSUE: Large component with extensive inline sx props throughout
 * FIX: Extract styled components or move repeated styles to theme overrides
 * MUI v7: Large sx objects reduce readability and increase re-render overhead
 * PATTERN: Use styled() for complex components, sx for one-off customizations
 *
 * ISSUE: Conditional styling logic scattered throughout component
 * FIX: Extract style computation functions or use styled() with transient props
 * FE Best Practice: Separate presentation logic from component logic for testability
 */
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
        {/**
         * ISSUE: Global styles injected at component level
         * FIX: Move to theme.components.MuiDrawer.styleOverrides.root
         * MUI v7: Component-level Global styles cause re-rendering and violate separation of concerns
         * PATTERN: All global overrides belong in theme configuration, not components
         */}
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
            /**
             * ISSUE: Hardcoded rgba values not using theme colors
             * FIX: Use theme.palette.background.paper with alpha() helper
             * MUI v7: alpha(theme.palette.background.paper, 0.08) for theme-aware transparency
             * PATTERN: theme => ({ backgroundColor: alpha(theme.palette.background.default, 0.8) })
             */
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
                  fontFamily: "CustomHeader, sans-serif",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                Ryan Barclay
              </Typography>
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
        {/**\n         * ISSUE: Theme-aware color logic duplicated in multiple places\n         * FIX: Create a reusable styled component or theme token\n         * MUI v7: Use theme.palette with alpha() instead of manual rgba strings\n         * PATTERN: Define glassmorphism effect in theme.components.MuiPaper.variants\n         */}
        \n{" "}
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
                backgroundColor: isDarkTheme
                  ? "rgba(0, 0, 0, 0.75)"
                  : "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(20px) saturate(180%)",
              },
            },
          }}
        >
          <Paper
            sx={{
              backgroundColor: isDarkTheme
                ? "rgba(0, 0, 0, 0.75)"
                : "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px) saturate(180%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 1,
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
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
                backgroundColor: isDarkTheme
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0, 0, 0, 0.3)",
                borderRadius: 3,
              }}
            />
          </Paper>

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
            {/**
             * ISSUE: Inline button styling with fontWeight and borderBottom logic
             * FIX: Create a NavButton styled component with active state handling
             * MUI v7: Use styled() with ownerState for active/inactive states
             * PATTERN: <NavButton active={isActive}> instead of ternary logic in sx
             */}
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
