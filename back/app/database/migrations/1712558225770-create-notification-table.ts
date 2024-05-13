import {ColumnType, MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

const tableName: string = 'notification';

export class CreateNotificationTable1712558225770 implements MigrationInterface {

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
              name: 'message',
              type: 'varchar' satisfies ColumnType,
              comment: 'сообщение'
            },
            {
              name: 'user_id',
              type: 'integer' satisfies ColumnType,
              comment: 'id пользователя'
            },
            {
              name: 'is_read',
              type: 'boolean' satisfies ColumnType,
              default: false,
              comment: 'Флаг того что сообщение прочитано'
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
