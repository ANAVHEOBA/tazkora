import { connectDB } from '../db';
import { AdminCrud } from '../modules/admin/admin.crud';

async function createInitialAdmin() {
    try {
        await connectDB();
        const adminCrud = new AdminCrud();
        await adminCrud.createInitialAdmin();
        console.log('Initial admin created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating initial admin:', error);
        process.exit(1);
    }
}

createInitialAdmin();