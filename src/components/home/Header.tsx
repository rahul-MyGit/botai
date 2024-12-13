'use client'
import React, { useState } from 'react';
import { UserAuthButton } from './auth-user-button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-teal-50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-teal-600">MeetBot</div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-teal-600 focus:outline-none"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        <nav className={`
          ${isMenuOpen ? 'block' : 'hidden'} 
          md:block absolute md:static 
          top-full left-0 right-0 
          bg-white md:bg-transparent 
          shadow-md md:shadow-none
          py-4 md:py-0
        `}>
          <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <li><a href="#features" className="text-gray-600 hover:text-teal-600">Features</a></li>
            <li><a href="#how-it-works" className="text-gray-600 hover:text-teal-600">How it works</a></li>
            <li>
              <UserAuthButton />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;