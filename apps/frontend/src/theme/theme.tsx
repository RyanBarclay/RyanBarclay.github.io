import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";
import "./fonts.css";

// Extend MUI theme types for custom palette tokens
declare module "@mui/material/styles" {
  interface Palette {
    gradient: {
      forest: string;
      ocean: string;
      sunset: string;
      hero: string;
    };
    overlay: {
      light: string;
      dark: string;
      hero: string;
    };
    ui: {
      switchThumbDark: string;
      switchThumbLight: string;
      switchTrack: string;
    };
    social: {
      github: string;
      linkedin: string;
      githubHover: string;
      linkedinHover: string;
      emailHover: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      forest?: string;
      ocean?: string;
      sunset?: string;
      hero?: string;
    };
    overlay?: {
      light?: string;
      dark?: string;
      hero?: string;
    };
    ui?: {
      switchThumbDark?: string;
      switchThumbLight?: string;
      switchTrack?: string;
    };
    social?: {
      github?: string;
      linkedin?: string;
      githubHover?: string;
      linkedinHover?: string;
      emailHover?: string;
    };
  }
  interface Duration {
    slow: number;
  }
}

// Extend Chip component types for custom variant
declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    technology: true;
  }
}

const sharedTheme: Partial<ThemeOptions> = {
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  shape: {
    borderRadius: 12, // Centralized border radius token
  },
  transitions: {
    duration: {
      slow: 600,
    },
  },
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.08)",
    "0px 2px 6px rgba(0,0,0,0.14), 0px 1px 4px rgba(0,0,0,0.10)",
    "0px 4px 10px rgba(0,0,0,0.16), 0px 2px 6px rgba(0,0,0,0.10)",
    "0px 4px 12px rgba(0,0,0,0.20), 0px 2px 8px rgba(0,0,0,0.12)",
    "0px 6px 16px rgba(0,0,0,0.24), 0px 3px 10px rgba(0,0,0,0.14)",
    "0px 6px 20px rgba(0,0,0,0.26), 0px 4px 12px rgba(0,0,0,0.16)",
    "0px 8px 24px rgba(0,0,0,0.15)",
    "0px 8px 28px rgba(0,0,0,0.20)",
    "0px 10px 32px rgba(0,0,0,0.22)",
    "0px 12px 36px rgba(0,0,0,0.24)",
    "0px 14px 40px rgba(0,0,0,0.26)",
    "0px 16px 44px rgba(0,0,0,0.28)",
    "0px 18px 48px rgba(0,0,0,0.30)",
    "0px 20px 52px rgba(0,0,0,0.32)",
    "0px 22px 56px rgba(0,0,0,0.34)",
    "0px 24px 60px rgba(0,0,0,0.36)",
    "0px 26px 64px rgba(0,0,0,0.38)",
    "0px 28px 68px rgba(0,0,0,0.40)",
    "0px 30px 72px rgba(0,0,0,0.42)",
    "0px 32px 76px rgba(0,0,0,0.44)",
    "0px 34px 80px rgba(0,0,0,0.46)",
    "0px 36px 84px rgba(0,0,0,0.48)",
    "0px 38px 88px rgba(0,0,0,0.50)",
    "0px 40px 92px rgba(0,0,0,0.52)",
  ] as Shadows,
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[7],
          },
        }),
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: "technology" as const },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 500,
          }),
        },
      ],
    },
  },
  typography: {
    // Intentional design choice: 12px base for compact UI
    fontSize: 12,
    fontFamily: [
      "BC Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
      letterSpacing: "0.02em",
    },
    h2: {
      fontFamily: "GreatForest, sans-serif",
      fontWeight: 400,
      fontSize: "2.5rem",
      lineHeight: 1.3,
      letterSpacing: "0.02em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "0.02em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
    },
    h5: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
  },
};

export const darkTheme = createTheme({
  ...sharedTheme,
  palette: {
    primary: {
      main: "#00A3A1", // BC teal - inspired by coastal waters
      light: "#4DD4D2",
      dark: "#007573",
    },
    secondary: {
      main: "#F58634", // Warm orange - inspired by BC sunsets
      light: "#FFB770",
      dark: "#C25A00",
    },
    error: {
      main: "#C13B2D", // Autumn Red Maple
      light: "#D96459",
      dark: "#8B291F",
    },
    warning: {
      main: "#D97D28", // Golden Larch (fall colors)
      light: "#E69952",
      dark: "#A65A1C",
    },
    info: {
      main: "#4E8A99", // Mountain Lake Blue
      light: "#6BA3B1",
      dark: "#35606C",
    },
    success: {
      main: "#6B9C5A", // Spring Meadow
      light: "#8BB47C",
      dark: "#4A6D3E",
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Better contrast for elevation
    },
    gradient: {
      forest: "linear-gradient(135deg, #2C5530 0%, #4A7C59 100%)",
      ocean: "linear-gradient(135deg, #5C9EAD 0%, #3D6B7D 100%)",
      sunset: "linear-gradient(135deg, #D97D28 0%, #C13B2D 100%)",
      hero: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    },
    overlay: {
      light: "rgba(245, 247, 245, 0.75)",
      dark: "rgba(42, 42, 42, 0.75)",
      hero: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
    },
    social: {
      github: "#333",
      linkedin: "#0077b5",
      githubHover: "#555",
      linkedinHover: "#005885",
      emailHover: "#00695c",
    },
    ui: {
      switchThumbDark: "#003892",
      switchThumbLight: "#5C9EAD",
      switchTrack: "#8796A5",
    },
    mode: "dark",
  },
});

export const lightTheme = createTheme({
  ...sharedTheme,
  palette: {
    primary: {
      main: "#00897B", // Forest green/teal - BC nature
      light: "#4EBAAA",
      dark: "#005B4F",
    },
    secondary: {
      main: "#FF6F3C", // Vibrant orange - BC outdoor adventure
      light: "#FFA270",
      dark: "#C53D0A",
    },
    error: {
      main: "#C13B2D",
      light: "#D96459",
      dark: "#8B291F",
    },
    warning: {
      main: "#D97D28",
      light: "#E69952",
      dark: "#A65A1C",
    },
    info: {
      main: "#4E8A99",
      light: "#6BA3B1",
      dark: "#35606C",
    },
    success: {
      main: "#6B9C5A",
      light: "#8BB47C",
      dark: "#4A6D3E",
    },
    background: {
      default: "#f8f9fa", // Subtle off-white background
      paper: "#ffffff", // White for cards/papers
    },
    gradient: {
      forest: "linear-gradient(135deg, #2C5530 0%, #4A7C59 100%)",
      ocean: "linear-gradient(135deg, #5C9EAD 0%, #3D6B7D 100%)",
      sunset: "linear-gradient(135deg, #D97D28 0%, #C13B2D 100%)",
      hero: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    },
    overlay: {
      light: "rgba(245, 247, 245, 0.75)",
      dark: "rgba(42, 42, 42, 0.75)",
      hero: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
    },
    social: {
      github: "#333",
      linkedin: "#0077b5",
      githubHover: "#555",
      linkedinHover: "#005885",
      emailHover: "#00695c",
    },
    ui: {
      switchThumbDark: "#003892",
      switchThumbLight: "#5C9EAD",
      switchTrack: "#aab4be",
    },
    mode: "light",
  },
});
