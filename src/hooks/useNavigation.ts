import { useNavigate } from "react-router-dom";

export type ExternalLink = `http${string}`;
export type InternalPath = `/${string}`;
export type NavigationUrl = ExternalLink | InternalPath;

export function useNavigation() {
  const navigate = useNavigate();

  return (url: NavigationUrl) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url);
    }
  };
}
