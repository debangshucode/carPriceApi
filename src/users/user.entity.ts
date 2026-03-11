import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Report } from '../reports/reports.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn() //auto generated id 
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default:true})
    admin:boolean
    
    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert() //hooks 
    logInsert() {
        console.log('Inserted user with id:', this.id);
    }
    @AfterUpdate()
    logUpdate() {
        console.log("Update user with id ", this.id)
    }
    @AfterRemove()
    logRemove() {
        console.log("Remove user with id ", this.id)
    }

}