import { app } from './app';
import { AppDataSource } from './config/database';
import 'reflect-metadata';
import 'dotenv/config';

AppDataSource.initialize().then(()=>{
  console.log("Database connected.");
  app.listen(3001, ()=>{ console.log("Backend running on port 3001")});
}).catch(err=> console.error(err));
