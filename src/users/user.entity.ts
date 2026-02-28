import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn() //auto generated id 
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

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