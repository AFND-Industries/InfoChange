import React, { createContext, useContext, useState, useEffect } from "react";

import { useAPI } from "../../../context/APIContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    return (
        <AdminContext.Provider
            value={{

            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);