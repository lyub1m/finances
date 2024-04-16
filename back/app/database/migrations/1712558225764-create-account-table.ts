import {ColumnType, MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

const tableName: string = 'account';

export class CreateAccountTable1712558225764 implements MigrationInterface {

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
                      name: 'sum',
                      type: 'integer' satisfies ColumnType,
                  },
                  {
                      name: 'user_id',
                      type: 'integer' satisfies ColumnType,
                  },
                  {
                      name: 'name',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'currency',
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
                      name: 'is_default',
                      type: 'boolean' satisfies ColumnType,
                      default: false
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
              name: 'fk_account_user',
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'user',
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
