import React, { useContext } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-scroll";
import { TransactionContext } from "../context/TransactionContext";
import logo from "../../images/logo.png";

const NavBarItem = ({ title, to, onClick }) => (
  <li className="mx-4 cursor-pointer">
    {to ? (
      <Link
        to={to}
        smooth={true}
        duration={500}
        className="cursor-pointer"
        activeClass="active"
      >
        {title}
      </Link>
    ) : (
      <span onClick={onClick} className="cursor-pointer">
        {title}
      </span>
    )}
  </li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  const { connectWallet } = useContext(TransactionContext);

  return (
    <nav className="w-full flex max-w-[75rem] justify-between items-center p-4 m-auto ">
      <div className="md:flex-[0.5] flex-initial items-center">
        <img src={logo} alt="logo" className="w-48 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        <NavBarItem key="transactions" title="Transactions" to="transactions" />
        <NavBarItem key="requests" title="Requests" to="requests" />
        <NavBarItem key="services" title="Services" to="services" />
        <NavBarItem key="wallets" title="Wallets" onClick={connectWallet} />
        <li
          onClick={() => {
            window.open("https://softrefine.com/", "_blank");
          }}
          className="py-2 px-5 mx-4 rounded-full cursor-pointer bg-gradient-to-r from-blue-300 to-blue-500 hover:from-sky-400 hover:via-rose-400 hover:to-lime-400"
        >
          Contact us
        </li>
      </ul>
      <div className="flex relative md:hidden">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            <NavBarItem
              key="transactions-mobile"
              title="Transactions"
              to="transactions"
            />
            <NavBarItem key="requests-mobile" title="Requests" to="requests" />
            <NavBarItem key="services-mobile" title="Services" to="services" />
            <NavBarItem
              key="wallets-mobile"
              title="Wallets"
              onClick={connectWallet}
            />
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
