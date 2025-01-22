import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entity/Product';

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    const {sku, weight, thickness, width, length} = req.body;
    const productRepo = AppDataSource.getRepository(Product);
    const product = productRepo.create({sku, weight, thickness, width, length, status:'yeni'});
    await productRepo.save(product);
    res.send(product);
  }

  static async listProducts(req: Request, res: Response) {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();
    res.send(products);
  }

  static async setPhotoRequired(req: Request, res: Response) {
    const { ids } = req.body; // seçilen ürün id listesi
    const productRepo = AppDataSource.getRepository(Product);

    for(let id of ids) {
      const p = await productRepo.findOne({where:{id}});
      if(p && p.status === 'yeni') {
        p.status = 'foto_gerekli';
        await productRepo.save(p);
      }
    }
    res.send({message:'Fotoğraf gereksinimi güncellendi.'});
  }

  static async exportProductsCSV(req: Request, res: Response) {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();
    const header = "id,sku,weight,thickness,width,length,status\n";
    const rows = products.map(p=>`${p.id},${p.sku},${p.weight},${p.thickness},${p.width},${p.length},${p.status}\n`).join('');
    const csv = header + rows;
    res.setHeader('Content-disposition', 'attachment; filename=products.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  }
}
