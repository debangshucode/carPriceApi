import { AfterInsert, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn() //auto generated id 
    id:number;

    @Column()
    email:string;

    @Column()
    password:string;

    
}