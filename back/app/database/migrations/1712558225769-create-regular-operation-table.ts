import {ColumnType, MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

const tableName: string = 'regular_operation';

export class CreateRegularOperationTable1712558225769 implements MigrationInterface {

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
              comment: 'сумма'
            },
            {
              name: 'category_id',
              type: 'integer' satisfies ColumnType,
              comment: 'id категории'
            },
            {
              name: 'account_id',
              type: 'integer' satisfies ColumnType,
              comment: 'id счета'
            },
            {
              name: 'user_id',
              type: 'integer' satisfies ColumnType,
              comment: 'id пользователя'
            },
            {
              name: 'comment',
              type: 'text' satisfies ColumnType,
              isNullable: true,
              comment: 'комментарий'
            },
            {
              name: 'is_enabled',
              type: 'boolean' satisfies ColumnType,
              default: true,
              comment: 'активность'
            },
            {
              name: 'period_code',
              type: 'varchar' satisfies ColumnType,
              comment: 'код периода (day, month, year и тд)'
            },
            {
              name: 'name',
              type: 'varchar' satisfies ColumnType,
              comment: 'название'
            },
            {
              name: 'time',
              type: 'varchar' satisfies ColumnType,
              comment: 'время платежа'
            },
            {
              name: 'date_start',
              type: 'timestamp' satisfies ColumnType,
              default: 'NOW()',
              comment: 'дата начала'
            },
            {
              name: 'date_end',
              type: 'timestamp' satisfies ColumnType,
              isNullable: true,
              comment: 'дата окончания'
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
