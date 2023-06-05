import React from 'react';
import '../assets/navbar.css';
import { FaUser } from 'react-icons/fa';

interface NavbarProps {
  activeOption: string;
  handleNavOptionClick: (option: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeOption, handleNavOptionClick }) => {
  return (
    <nav className="navbar bg-gradient-to-r from-gray-200 via-gray-150 to-gray-200">
      <div className="navbar-logo">
        {/* Add your logo or icon here */}
        <FaUser />
      </div>
      <ul className="navbar-options">
        <li
          className={`navbar-option ${activeOption === 'Chatbot' ? 'active' : ''}`}
          onClick={() => handleNavOptionClick('Chatbot')}
        >
          <i className="fas fa-comment"></i>
          <span>Chatbot</span>
        </li>
        <li
          className={`navbar-option ${activeOption === 'FAQ Bank' ? 'active' : ''}`}
          onClick={() => handleNavOptionClick('FAQ Bank')}
        >
          <i className="fas fa-book"></i>
          <span>FAQ Bank</span>
        </li>
        <li
          className={`navbar-option ${activeOption === 'RAW PDF' ? 'active' : ''}`}
          onClick={() => handleNavOptionClick('RAW PDF')}
        >
          <i className="fas fa-book"></i>
          <span>RAW PDF</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
