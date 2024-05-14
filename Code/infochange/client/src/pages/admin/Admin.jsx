import React from 'react';

import { AdminProvider } from './context/AdminContext';
import AdminPage from './AdminPage';

function Admin() {
    return (
        <AdminProvider>
            <AdminPage />
        </AdminProvider>
    );
}

export default Admin;
