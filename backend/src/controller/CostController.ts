import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cost } from '../entity/Cost';
import { Product } from '../entity/Product';
import { SystemParam } from '../entity/SystemParam';

export class CostController {
  static async listPriceNeeded(req: Request, res: Response) {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({where:{status:'fiyat_gerekli'}});
    res.send(products);
  }

  static async setProductPrice(req: Request, res: Response) {
    const { productId } = req.body;

    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({where:{id:productId}});
    if(!product) return res.status(404).send({message:'Product not found'});

    const costRepo = AppDataSource.getRepository(Cost);
    let cost = await costRepo.findOne({where:{product:{id:productId}}});
    if(!cost) {
      cost = costRepo.create({product});
    }

    const paramRepo = AppDataSource.getRepository(SystemParam);
    const goldPriceParam = await paramRepo.findOne({where:{param_key:'gold_price_per_gram'}});
    const shipParam = await paramRepo.findOne({where:{param_key:'shipping_cost'}});
    const advParam = await paramRepo.findOne({where:{param_key:'advertising_cost'}});

    const goldPrice = goldPriceParam ? parseFloat(goldPriceParam.param_value) : 1000;
    const shipping = shipParam ? parseFloat(shipParam.param_value) : 50;
    const adv = advParam ? parseFloat(advParam.param_value) : 20;

    const calculated = (product.weight * goldPrice) + shipping + adv;

    cost.gold_price_per_gram = goldPrice;
    cost.shipping_cost = shipping;
    cost.advertising_cost = adv;
    cost.calculated_price = calculated;

    await costRepo.save(cost);

    product.status = 'fiyat_belirlendi';
    await productRepo.save(product);

    res.send({message:'Fiyat belirlendi', cost});
  }

  static async listAll(req: Request, res: Response) {
    const costRepo = AppDataSource.getRepository(Cost);
    const costs = await costRepo.find({relations:['product']});
    res.send(costs);
  }

  static async exportCostsCSV(req: Request, res: Response) {
    const costRepo = AppDataSource.getRepository(Cost);
    const costs = await costRepo.find({relations:['product']});
    const header = "product_sku,gold_price_per_gram,shipping_cost,advertising_cost,calculated_price\n";
    const rows = costs.map(c=>`${c.product.sku},${c.gold_price_per_gram},${c.shipping_cost},${c.advertising_cost},${c.calculated_price}\n`).join('');
    const csv = header + rows;
    res.setHeader('Content-disposition', 'attachment; filename=costs.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  }
}
