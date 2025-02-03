import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entity/Product';

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    const {sku, weight, thickness, width, length, karat} = req.body;
    const productRepo = AppDataSource.getRepository(Product);
    const product = productRepo.create({
      sku, 
      weight, 
      thickness, 
      width, 
      length, 
      karat: karat || 14, // Varsayılan olarak 14K
      status: 'yeni'
    });
    await productRepo.save(product);
    res.send(product);
  }

  static async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { karat, ...rest } = req.body;
    
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!product) {
      return res.status(404).send({ message: 'Ürün bulunamadı' });
    }

    // Karat değerini güncelle
    if (karat !== undefined) {
      product.karat = karat;
    }

    // Diğer alanları güncelle
    Object.assign(product, rest);

    await productRepo.save(product);
    res.send(product);
  }

  static async listProducts(req: Request, res: Response) {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      relations: ['costs', 'seo_infos']
    });
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
    const products = await productRepo.find({
      relations: ['costs', 'seo_infos']
    });
    
    const header = "id,sku,weight,thickness,width,length,status,gold_price,labor_cost,shipping_cost,shopify_commission,etsy_commission,amazon_commission,hepsiburada_commission,trendyol_commission,payment_commission,shopify_final,etsy_final,amazon_final,hepsiburada_final,trendyol_final\n";
    
    const rows = products.map(p => {
      const cost = p.costs?.[0];
      return `${p.id},${p.sku},${p.weight},${p.thickness},${p.width},${p.length},${p.status},${cost?.gold_price_per_gram || ''},${cost?.labor_cost || ''},${cost?.shipping_cost || ''},${cost?.shopify_commission || ''},${cost?.etsy_commission || ''},${cost?.amazon_commission || ''},${cost?.hepsiburada_commission || ''},${cost?.trendyol_commission || ''},${cost?.payment_commission || ''},${cost?.shopify_final_price || ''},${cost?.etsy_final_price || ''},${cost?.amazon_final_price || ''},${cost?.hepsiburada_final_price || ''},${cost?.trendyol_final_price || ''}\n`;
    }).join('');
    
    const csv = header + rows;
    res.setHeader('Content-disposition', 'attachment; filename=products.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  }
}
