import {ColumnType, MigrationInterface, QueryRunner, Table} from "typeorm";

const tableName: string = 'user';

export class CreateUserTable1712558225762 implements MigrationInterface {

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
                      name: 'login',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'password',
                      type: 'varchar' satisfies ColumnType,
                  },
                  {
                      name: 'name',
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
