import useLogout from "../../hooks/useLogout";

function LogoutButton() {
  const { logout } = useLogout();

  function handleLogout() {
    logout();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded border border-zoovanna-brown px-2"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
