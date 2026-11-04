import { app } from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set and at least 32 characters long');
  process.exit(1);
}
try {
  await connectDB();
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
} catch (e) {
  console.error('Failed to start:', e.message);
  process.exit(1);
}
