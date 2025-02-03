import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKaratAndTypeToProduct1706361600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Önce enum tipleri oluştur
        await queryRunner.query(`
            CREATE TYPE "product_karat_enum" AS ENUM ('10K', '14K', '18K')
        `);

        await queryRunner.query(`
            CREATE TYPE "product_type_enum" AS ENUM ('Yüzük', 'Kolye', 'Küpe', 'Bileklik', 'Zincir', 'Kolye Ucu')
        `);

        // Sonra kolonları ekle
        await queryRunner.query(`
            ALTER TABLE "product" 
            ADD COLUMN "karat" "product_karat_enum" NOT NULL DEFAULT '14K',
            ADD COLUMN "type" "product_type_enum" NOT NULL DEFAULT 'Yüzük'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Kolonları kaldır
        await queryRunner.query(`
            ALTER TABLE "product" 
            DROP COLUMN "karat",
            DROP COLUMN "type"
        `);

        // Enum tipleri kaldır
        await queryRunner.query(`DROP TYPE "product_karat_enum"`);
        await queryRunner.query(`DROP TYPE "product_type_enum"`);
    }
} 