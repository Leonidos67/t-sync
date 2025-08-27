import { AudioWaveform } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = (props: { url?: string | null }) => {
  const { url = "/u/" } = props;
  const content = (
    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <AudioWaveform className="size-4" />
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {url ? <Link to={url}>{content}</Link> : content}
    </div>
  );
};

export default Logo;
