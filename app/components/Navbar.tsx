import React from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = (): React.ReactElement => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>

      <div className="flex gap-3">

        {/* Upload Button */}
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>

        {/* Wipe Data Button */}
        <Link to="/wipe" className="primary-button w-fit bg-red-500 text-white">
          Wipe Data
        </Link>

        {/* Login / Logout */}
        {!auth.isAuthenticated ? (
          <Link to="/auth" className="primary-button w-fit">
            Login
          </Link>
        ) : (
          <button className="primary-button w-fit" onClick={auth.signOut}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
