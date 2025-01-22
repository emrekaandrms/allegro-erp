import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1680000000000 implements MigrationInterface {
    name = 'CreateTables1680000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('operasyon','fotoğraf','muhasebe','seo','admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'operasyon', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_email" UNIQUE("email"), CONSTRAINT "PK_user_id" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('yeni','foto_gerekli','foto_yuklendi','fiyat_gerekli','fiyat_belirlendi','seo_gerekli','hazır')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "sku" character varying NOT NULL, "weight" double precision NOT NULL, "thickness" double precision NOT NULL, "width" double precision NOT NULL, "length" double precision NOT NULL, "status" "public"."product_status_enum" NOT NULL DEFAULT 'yeni', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_product_sku" UNIQUE("sku"), CONSTRAINT "PK_product_id" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TABLE "photo" ("id" SERIAL NOT NULL, "photo_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_photo_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_photo_productId" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "cost" ("id" SERIAL NOT NULL, "gold_price_per_gram" double precision, "shipping_cost" double precision, "advertising_cost" double precision, "calculated_price" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_cost_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cost" ADD CONSTRAINT "FK_cost_productId" FOREIGN KEY ("productId") REFERENCES "product"("id")`);

        await queryRunner.query(`CREATE TYPE "public"."seo_info_platform_enum" AS ENUM('shopify','etsy','trendyol','amazon','hepsiburada')`);
        await queryRunner.query(`CREATE TABLE "seo_info" ("id" SERIAL NOT NULL, "platform" "public"."seo_info_platform_enum" NOT NULL, "title" character varying NOT NULL, "description" character varying, "meta_title" character varying, "meta_description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_seo_info_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "seo_info" ADD CONSTRAINT "FK_seo_info_productId" FOREIGN KEY ("productId") REFERENCES "product"("id")`);

        await queryRunner.query(`CREATE TABLE "system_param" ("id" SERIAL NOT NULL, "param_key" character varying NOT NULL, "param_value" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_system_param_id" PRIMARY KEY ("id"))`);
        
        // Varsayılan parametreler
        await queryRunner.query(`INSERT INTO "system_param"(param_key, param_value) VALUES('gold_price_per_gram','1000')`);
        await queryRunner.query(`INSERT INTO "system_param"(param_key, param_value) VALUES('shipping_cost','50')`);
        await queryRunner.query(`INSERT INTO "system_param"(param_key, param_value) VALUES('advertising_cost','20')`);

        // Varsayılan kullanıcı
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash('123456',10);
        await queryRunner.query(`INSERT INTO "user"(email, password_hash, role) VALUES('admin@example.com','${hash}','admin')`);
        await queryRunner.query(`INSERT INTO "user"(email, password_hash, role) VALUES('operasyon@example.com','${hash}','operasyon')`);
        await queryRunner.query(`INSERT INTO "user"(email, password_hash, role) VALUES('foto@example.com','${hash}','fotoğraf')`);
        await queryRunner.query(`INSERT INTO "user"(email, password_hash, role) VALUES('muhasebe@example.com','${hash}','muhasebe')`);
        await queryRunner.query(`INSERT INTO "user"(email, password_hash, role) VALUES('seo@example.com','${hash}','seo')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "seo_info"`);
        await queryRunner.query(`DROP TABLE "cost"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "system_param"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."seo_info_platform_enum"`);
    }

}
