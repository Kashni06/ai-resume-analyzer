import React from "react";
import {Link} from "react-router";
const Navbar = (): React.ReactElement => {
  return <nav className="navbar">
    <Link to="/">
      <p className="text-2xl font-bold text-gradient">RESUMIND</p>
    </Link>
    <Link to="/about" className="primary-button w-fit">
      Upload Resume
    </Link>
  </nav>;
};

export default Navbar;
