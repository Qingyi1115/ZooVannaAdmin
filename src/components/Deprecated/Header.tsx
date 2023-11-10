import LogoutButton from "../Header/LogoutButton";

interface PropsType {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

function Header(props: PropsType) {
  const { sidebarOpen, setSidebarOpen } = props;

  return (
    <header className="sticky top-0 z-30 border-b border-zoovanna-beige bg-zoovanna-cream-100">
      <div className="px-4">
        <div className="-mb-px flex h-16 items-center justify-between">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-black hover:text-slate-600"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6 fill-zoovanna-brown"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
