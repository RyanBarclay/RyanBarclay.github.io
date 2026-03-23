import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigation, NavigationUrl } from "../../hooks/useNavigation";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  detailPage: NavigationUrl;
  tag?: string;
}

const ProjectCard = ({
  title,
  description,
  image,
  technologies,
  detailPage,
  tag,
}: ProjectCardProps) => {
  const handleLinkClick = useNavigation();

  const handleClick = () => {
    if (detailPage) {
      handleLinkClick(detailPage);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: detailPage ? "pointer" : "default",
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
            ".MuiCard-root:hover &": { transform: "scale(1.05)" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: (theme) =>
              `linear-gradient(to top, ${alpha(theme.palette.primary.dark, 0.6)}, transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            ".MuiCard-root:hover &": { opacity: 1 },
            pointerEvents: "none",
          }}
        />
        {tag && (
          <Chip
            label={tag}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: tag === "ARCHIVED"
                ? (theme) => alpha(theme.palette.text.secondary, 0.25)
                : "primary.main",
              color: tag === "ARCHIVED" ? "text.secondary" : "primary.contrastText",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          {description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {technologies.map((tech) => (
            <Chip key={tech} label={tech} size="small" variant="technology" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
