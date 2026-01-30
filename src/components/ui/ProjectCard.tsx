import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useNavigation, NavigationUrl } from "../../hooks/useNavigation";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  detailPage: NavigationUrl;
}

const ProjectCard = ({
  title,
  description,
  image,
  technologies,
  detailPage,
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
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
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
