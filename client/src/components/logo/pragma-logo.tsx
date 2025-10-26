import { Link } from "react-router-dom";
import pragmaLogo from "@/assets/logo/pragma.png";

const PragmaLogo = (props: { url?: string | null }) => {
  const { url = "/services#pragma" } = props;
  const content = (
    <div className="inline-flex items-center justify-center rounded-[4px] p-1 bg-white dark:bg-white">
      <img src={pragmaLogo} alt="Pragma Aurora Rise" className="h-4 w-4 object-contain" />
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {url ? <Link to={url}>{content}</Link> : content}
    </div>
  );
};

export default PragmaLogo;

