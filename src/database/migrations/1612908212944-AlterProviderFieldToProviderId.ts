import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export default class AlterProviderFieldToProviderId1612908212944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // dropando a coluna
    await queryRunner.dropColumn('appointments', 'provider');

    // adicionando a coluna nova com o nome novo
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({ name: 'provider_id', type: 'uuid', isNullable: true }),
    );

    // definindo que a coluna nova será uma ForeignKey
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['provider_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

    await queryRunner.dropColumn('appointments', 'provider_id');

    await queryRunner.addColumn('appointments', new TableColumn({ name: 'provider', type: 'varchar' }));
  }
}
