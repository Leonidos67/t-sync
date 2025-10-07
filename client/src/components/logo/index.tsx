import { Link } from "react-router-dom";
import logoLight from "@/assets/logo(black).png";
import logoDark from "@/assets/logo(white).png";

const Logo = (props: { url?: string | null }) => {
  const { url = "/u/" } = props;
  const content = (
    <div className="inline-flex items-center justify-center rounded-[4px] bg-black dark:bg-white p-1">
      <img
        src={logoDark}
        alt="Atlass Rise"
        className="block dark:hidden h-3 w-3 object-contain"
      />
      <img
        src={logoLight}
        alt="Atlass Rise"
        className="hidden dark:block h-3 w-3 object-contain"
      />
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {url ? <Link to={url}>{content}</Link> : content}
    </div>
  );
};

export default Logo;
