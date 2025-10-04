import { Link } from "react-router-dom";

const IdLogo = (props: { url?: string | null }) => {
  const { url = "/id" } = props;
  const content = (
    <div className="flex h-6 w-6 items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="40" fill="#4F46E5" stroke="#3730A3" strokeWidth="2"/>
        <g>
          <circle cx="60" cy="100" r="15" fill="#10B981" stroke="#047857" strokeWidth="1.5"/>
          <text x="60" y="105" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S1</text>
        </g>
        <g>
          <circle cx="140" cy="100" r="15" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5"/>
          <text x="140" y="105" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S2</text>
        </g>
        <g>
          <circle cx="100" cy="60" r="15" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
          <text x="100" y="65" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S3</text>
        </g>
        <g>
          <circle cx="100" cy="140" r="15" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.5"/>
          <text x="100" y="145" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S4</text>
        </g>
        <line x1="85" y1="100" x2="115" y2="100" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
        <line x1="100" y1="85" x2="100" y2="115" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3"/>
        <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ID</text>
      </svg>
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {url ? <Link to={url}>{content}</Link> : content}
    </div>
  );
};

export default IdLogo;
