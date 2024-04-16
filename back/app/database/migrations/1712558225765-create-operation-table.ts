import {ColumnType, MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

const tableName: string = 'operation';

export class CreateOperationTable1712558225765 implements MigrationInterface {

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
                      name: 'category_id',
                      type: 'integer' satisfies ColumnType,
                  },
                  {
                      name: 'account_id',
                      type: 'integer' satisfies ColumnType,
                  },
                  {
                      name: 'user_id',
                      type: 'integer' satisfies ColumnType,
                  },
                  {
                      name: 'comment',
                      type: 'text' satisfies ColumnType,
                      isNullable: true,
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
              name: 'fk_operation_user',
              columnNames: ['user_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'user',
          }),
        );
        await queryRunner.createForeignKey(
          tableName,
          new TableForeignKey({
              name: 'fk_operation_category',
              columnNames: ['category_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'category',
          }),
        );
        await queryRunner.createForeignKey(
          tableName,
          new TableForeignKey({
              name: 'fk_operation_account',
              columnNames: ['account_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'account',
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
