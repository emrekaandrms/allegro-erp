import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCostAndSEOTables1706360100000 implements MigrationInterface {
    name = 'UpdateCostAndSEOTables1706360100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables
        await queryRunner.query(`DROP TABLE IF EXISTS "cost"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "seo_info"`);

        // Create new cost table
        await queryRunner.query(`
            CREATE TABLE "cost" (
                "id" SERIAL NOT NULL,
                "gold_price_per_gram" float NOT NULL,
                "labor_cost" float NOT NULL,
                "shipping_cost" float NOT NULL,
                "shopify_commission" float NOT NULL,
                "etsy_commission" float NOT NULL,
                "amazon_commission" float NOT NULL,
                "hepsiburada_commission" float NOT NULL,
                "trendyol_commission" float NOT NULL,
                "payment_commission" float NOT NULL,
                "shopify_final_price" float NOT NULL,
                "etsy_final_price" float NOT NULL,
                "amazon_final_price" float NOT NULL,
                "hepsiburada_final_price" float NOT NULL,
                "trendyol_final_price" float NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "product_id" integer,
                CONSTRAINT "PK_cost" PRIMARY KEY ("id")
            )
        `);

        // Create new seo_info table
        await queryRunner.query(`
            CREATE TABLE "seo_info" (
                "id" SERIAL NOT NULL,
                "platform" varchar NOT NULL CHECK (platform IN ('shopify', 'etsy', 'amazon', 'hepsiburada', 'trendyol')),
                "title" varchar NOT NULL,
                "description" text NOT NULL,
                "meta_title" varchar NOT NULL,
                "meta_description" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "product_id" integer,
                CONSTRAINT "PK_seo_info" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "cost" 
            ADD CONSTRAINT "FK_cost_product" 
            FOREIGN KEY ("product_id") 
            REFERENCES "product"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "seo_info" 
            ADD CONSTRAINT "FK_seo_info_product" 
            FOREIGN KEY ("product_id") 
            REFERENCES "product"("id") 
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "cost" DROP CONSTRAINT "FK_cost_product"`);
        await queryRunner.query(`ALTER TABLE "seo_info" DROP CONSTRAINT "FK_seo_info_product"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "cost"`);
        await queryRunner.query(`DROP TABLE "seo_info"`);
    }
} 