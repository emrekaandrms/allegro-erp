import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { SEOInfo } from '../entity/SEOInfo';
import { Product } from '../entity/Product';

export class SEOController {
  static platforms = ['shopify','etsy','trendyol','amazon','hepsiburada'];

  static async listSEORequired(req: Request, res: Response) {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({where:{status:'seo_gerekli'}});
    res.send(products);
  }

  static async setSEOInfo(req: Request, res: Response) {
    const {productId, seoData} = req.body;
    const productRepo = AppDataSource.getRepository(Product);
    const seoRepo = AppDataSource.getRepository(SEOInfo);

    const product = await productRepo.findOne({where:{id:productId}});
    if(!product) return res.status(404).send({message:'Product not found'});

    for(let s of seoData) {
      const {platform, title, description, meta_title, meta_description} = s;
      let seoInfo = seoRepo.create({product, platform, title, description, meta_title, meta_description});
      await seoRepo.save(seoInfo);
    }

    product.status = 'hazır';
    await productRepo.save(product);

    res.send({message:'SEO bilgileri girildi'});
  }
}
