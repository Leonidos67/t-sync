import { Link } from "react-router-dom";
import voltLogo from "@/assets/logo/volt.png";

const SocialLogo = (props: { url?: string | null }) => {
  const { url = "/u/" } = props;
  const content = (
    <div className="inline-flex items-center justify-center rounded-[4px] p-1 bg-white">
      <img src={voltLogo} alt="Aurora Volt" className="h-4 w-4 object-contain" />
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {url ? <Link to={url}>{content}</Link> : content}
    </div>
  );
};

export default SocialLogo;
