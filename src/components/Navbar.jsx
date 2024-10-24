import React from "react";
// import { useTheme } from "../context/ThemeContext"

const Navbar = ({title}) => {
    // const { theme, toggleTheme } = useTheme();
    
    return (
        <nav className="bg-gray-900 p-4 shadow-lg relative z-10">
            <div className="mx-auto flex justify-between items-center">
                <div className="text-gray-300 text-2xl font-bold">
                    {title}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;