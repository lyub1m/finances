import {ColumnType, MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

const tableName: string = 'currency';

export class CreateCurrencyTable1712558225768 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: tableName,
          columns: [
            {
                name: 'code',
                type: 'varchar' satisfies ColumnType,
                isPrimary: true,
            },
            {
                name: 'name',
                type: 'varchar' satisfies ColumnType,
            },
            {
                name: 'character',
                type: 'varchar' satisfies ColumnType,
            },
            {
                name: 'rate',
                type: 'float' satisfies ColumnType,
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
      const values = [
        { name: 'Российский рубль', code: 'RUB', character: '₽', rate: 1 },
        { name: 'Доллар США', code: 'USD', character: '$', rate: 92 },
        { name: 'Евро', code: 'EUR', character: '€', rate: 100 },
        { name: 'Казахстанских тенге', code: 'KZT', character: '₸', rate: 0.20 },
        { name: "Австралийский доллар", code: "AUD", rate: 61, character: "$" },
        { name: "Канадский доллар", code: "CAD", rate: 68, character: "$" },
        { name: "Швейцарский франк", code: "CHF", rate: 102, character: "Fr." },
        { name: "Японских иен", code: "JPY", rate: 0.61, character: "¥" },
        { name: "Новозеландский доллар", code: "NZD", rate: 56, character: "$" },
        { name: "Фунт стерлингов Соединенного королевства", code: "GBP", rate: 117, character: "£" },
        { name: "Шведских крон", code: "SEK", rate: 8.7, character: "kr" },
        { name: "Датская крона", code: "DKK", rate: 13, character: "kr" },
        { name: "Норвежских крон", code: "NOK", rate: 8.6, character: "kr" },
        { name: "Сингапурский доллар", code: "SGD", rate: 68, character: "$" },
        { name: "Чешских крон", code: "CZK", rate: 3.9, character: "Kč" },
        { name: "Гонконгский доллар", code: "HKD", rate: 11, character: "$" },
        { name: "Польский злотый", code: "PLN", rate: 23, character: "zł" },
        { name: "Турецких лир", code: "TRY", rate: 2.8, character: "₺" },
        { name: "Южноафриканских рэндов", code: "ZAR", rate: 5, character: "R" },
      ].map(e => `('${e.name}', '${e.code}', ${e.rate}, '${e.character}')`).join(', ');
      await queryRunner.query(`
            insert into ${tableName} (name, code, rate, character)
            values ${values}
      `);
      await queryRunner.createForeignKey(
        'account',
        new TableForeignKey({
          name: 'fk_account_currency',
          columnNames: ['currency'],
          referencedColumnNames: ['code'],
          referencedTableName: tableName,
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
