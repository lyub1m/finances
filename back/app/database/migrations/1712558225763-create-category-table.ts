import {ColumnType, MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

const tableName: string = 'category';

export class CreateCategoryTable1712558225763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
              name: tableName,
              columns: [
                  {
                      name: 'id',
                      type: 'integer' satisfies ColumnType,
                      isPrimary: true,
                      isGenerated: true,
                  },
                  {
                      name: 'user_id',
                      type: 'integer' satisfies ColumnType,
                      isNullable: true,
                  },
                  {
                      name: 'name',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'type',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'color',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'icon',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'created_at',
                      type: 'timestamp' satisfies ColumnType,
                      default: 'NOW()',
                  },
                  {
                      name: 'updated_at',
                      type: 'timestamp' satisfies ColumnType,
                      default: 'NOW()',
                  },
              ],
          }),
          true,
        );
        await queryRunner.createForeignKey(
          tableName,
          new TableForeignKey({
              name: 'fk_category_user',
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'user',
          }),
        );
        await queryRunner.query(`
            insert into ${tableName} (name, type, color, icon)
            values 
                ('Продукты', 'out', '#F49E31', 'store-24-hour'),
                ('Ремонт', 'out', '#66A653', 'android-studio'),
                ('Ипотека', 'out', '#389BF3', 'home'),
                ('Здоровье', 'out', '#389BF3', 'heart-cog'),
                ('Зарплата', 'in', '#FFE64D', 'file-document'),
                ('Инвестиции', 'in', '#165738D6', 'bitcoin'),
                ('Подарок', 'in', '#E75B43', 'gift')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
