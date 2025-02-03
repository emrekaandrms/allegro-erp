import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cost } from '../entity/Cost';
import { Product } from '../entity/Product';

export class CostController {
  static async createCost(req: Request, res: Response) {
    const { 
      product_id, 
      gold_price_per_gram,
      labor_cost,
      shipping_cost,
      shopify_commission,
      etsy_commission,
      amazon_commission,
      hepsiburada_commission,
      trendyol_commission,
      payment_commission
    } = req.body;

    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({ where: { id: product_id } });

    if (!product) {
      return res.status(404).send({ message: 'Ürün bulunamadı' });
    }

    const costRepo = AppDataSource.getRepository(Cost);
    const cost = costRepo.create({
      product,
      gold_price_per_gram,
      labor_cost,
      shipping_cost,
      shopify_commission,
      etsy_commission,
      amazon_commission,
      hepsiburada_commission,
      trendyol_commission,
      payment_commission
    });

    // Final fiyatları hesapla
    const basePrice = gold_price_per_gram * product.weight;
    cost.shopify_final_price = basePrice + labor_cost + shipping_cost + shopify_commission + payment_commission;
    cost.etsy_final_price = basePrice + labor_cost + shipping_cost + etsy_commission + payment_commission;
    cost.amazon_final_price = basePrice + labor_cost + shipping_cost + amazon_commission + payment_commission;
    cost.hepsiburada_final_price = basePrice + labor_cost + shipping_cost + hepsiburada_commission + payment_commission;
    cost.trendyol_final_price = basePrice + labor_cost + shipping_cost + trendyol_commission + payment_commission;

    await costRepo.save(cost);
    res.send(cost);
  }

  static async listCosts(req: Request, res: Response) {
    const costRepo = AppDataSource.getRepository(Cost);
    const costs = await costRepo.find({
      relations: ['product']
    });
    res.send(costs);
  }

  static async exportCostsCSV(req: Request, res: Response) {
    const costRepo = AppDataSource.getRepository(Cost);
    const costs = await costRepo.find({
      relations: ['product']
    });

    const header = "SKU,Altın Gram Fiyatı,İşçilik,Kargo,Shopify Komisyon,Etsy Komisyon,Amazon Komisyon,Hepsiburada Komisyon,Trendyol Komisyon,Ödeme Komisyon,Shopify Final,Etsy Final,Amazon Final,Hepsiburada Final,Trendyol Final\n";
    const rows = costs.map(c => 
      `${c.product.sku},${c.gold_price_per_gram},${c.labor_cost},${c.shipping_cost},${c.shopify_commission},${c.etsy_commission},${c.amazon_commission},${c.hepsiburada_commission},${c.trendyol_commission},${c.payment_commission},${c.shopify_final_price},${c.etsy_final_price},${c.amazon_final_price},${c.hepsiburada_final_price},${c.trendyol_final_price}\n`
    ).join('');

    const csv = header + rows;
    res.setHeader('Content-disposition', 'attachment; filename=costs.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  }

  static async updateCost(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { 
        gold_price_per_gram,
        labor_cost,
        shipping_cost,
        shopify_commission,
        etsy_commission,
        amazon_commission,
        hepsiburada_commission,
        trendyol_commission,
        payment_commission
      } = req.body;

      console.log('Gelen veri:', {
        productId,
        body: req.body
      });

      const productRepo = AppDataSource.getRepository(Product);
      const costRepo = AppDataSource.getRepository(Cost);

      const product = await productRepo.findOne({ where: { id: parseInt(productId) } });
      if (!product) {
        return res.status(404).send({ message: 'Ürün bulunamadı' });
      }

      let cost = await costRepo.findOne({ where: { product: { id: product.id } } });
      if (!cost) {
        cost = costRepo.create({ product });
      }

      // Gelen değerleri güncelle
      if (gold_price_per_gram !== undefined) cost.gold_price_per_gram = gold_price_per_gram;
      if (labor_cost !== undefined) cost.labor_cost = labor_cost;
      if (shipping_cost !== undefined) cost.shipping_cost = shipping_cost;
      if (shopify_commission !== undefined) cost.shopify_commission = shopify_commission;
      if (etsy_commission !== undefined) cost.etsy_commission = etsy_commission;
      if (amazon_commission !== undefined) cost.amazon_commission = amazon_commission;
      if (hepsiburada_commission !== undefined) cost.hepsiburada_commission = hepsiburada_commission;
      if (trendyol_commission !== undefined) cost.trendyol_commission = trendyol_commission;
      if (payment_commission !== undefined) cost.payment_commission = payment_commission;

      // Final fiyatları hesapla
      const basePrice = cost.gold_price_per_gram * product.weight;
      cost.shopify_final_price = basePrice + cost.labor_cost + cost.shipping_cost + cost.shopify_commission + cost.payment_commission;
      cost.etsy_final_price = basePrice + cost.labor_cost + cost.shipping_cost + cost.etsy_commission + cost.payment_commission;
      cost.amazon_final_price = basePrice + cost.labor_cost + cost.shipping_cost + cost.amazon_commission + cost.payment_commission;
      cost.hepsiburada_final_price = basePrice + cost.labor_cost + cost.shipping_cost + cost.hepsiburada_commission + cost.payment_commission;
      cost.trendyol_final_price = basePrice + cost.labor_cost + cost.shipping_cost + cost.trendyol_commission + cost.payment_commission;

      await costRepo.save(cost);
      res.send(cost);
    } catch (error) {
      console.error('Cost update error:', error);
      res.status(500).send({ message: 'Maliyet güncellenirken bir hata oluştu' });
    }
  }
}
