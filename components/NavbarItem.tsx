import React from "react";

interface NavbarItemProsp {
    label: string;
}

const NavbarItem: React.FC<NavbarItemProsp> = function({
    label
}) {
    return (
        <div className="text-white cursor-pointer hover:text-gray transition">
            {label}
        </div>
    )
}

export default NavbarItem;