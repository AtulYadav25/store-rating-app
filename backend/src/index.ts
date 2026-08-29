import app from './app.js';
import { seedAdmin } from './utils/seedAdmin.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();