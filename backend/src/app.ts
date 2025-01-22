import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import photoRoutes from './routes/photoRoutes';
import costRoutes from './routes/costRoutes';
import seoRoutes from './routes/seoRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/admin', adminRoutes);

export {app};
