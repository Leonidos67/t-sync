import { Link } from "react-router-dom";

const SocialLogo = (props: { url?: string | null }) => {
  const { url = "/u/" } = props;
  const content = (
    <div className="flex h-6 w-6 items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="24" height="24">
        <circle cx="60" cy="60" r="54" fill="#0f9d58"/>
        <g transform="translate(60,60)" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle r="28"/>
          <path d="M-24 0 q20 -12 48 0" />
          <path d="M-18 -18 q14 8 36 0" />
          <path d="M-6 18 q6 -12 18 -18" />
        </g>
        <path d="M14 84 q22 -30 46 -10 q18 16 46 -14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {url ? <Link to={url}>{content}</Link> : content}
    </div>
  );
};

export default SocialLogo;
