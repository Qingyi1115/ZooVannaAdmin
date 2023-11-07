import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default">
        <span className="text-title-xxl">Oops</span>
        <span className="text-xl text-danger">404 - Page Not Found</span>
        <span>
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable
        </span>
        <NavLink to="/">
          <Button>Go to Homepage</Button>
        </NavLink>
      </div>
    </div>
  );
}

export default NotFoundPage;
