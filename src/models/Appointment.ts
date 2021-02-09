// import { v4 } from 'uuid';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // Sem argumento default varchar
  provider: string;

  @Column('time with time zone') // Se não estiver utilizando postgres, não terá suporte ao "with time zone"
  date: Date;

  // A função do constructor está sendo subjugada pelo TypeORM.
  // constructor({ provider, date }: Omit<Appointment, 'id'>) {
  //   this.id = v4();
  //   this.provider = provider;
  //   this.date = date;
  // }
}

export default Appointment;
