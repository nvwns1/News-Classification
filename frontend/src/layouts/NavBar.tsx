import { useNavigate } from "react-router-dom";
import { isLoggedin } from "../utils/login";
import { removeToken } from "../utils/sessions";

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    removeToken();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 fixed z-10">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          News Classification
        </a>
      </div>
      {isLoggedin() && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <a onClick={handleLogout}>Logout</a>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
