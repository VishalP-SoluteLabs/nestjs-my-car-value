// import { Exclude } from "class-transformer";
import { Report } from "src/reports/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
  //@Exclude()    //whenever you take an instance of a user and turn them into a plain object and then into JSON, just exclude the password
    password: string;

    @Column({default: true})
    admin: boolean;

    @OneToMany(() => Report, (report)=>report.user)
    reports: Report[];

    @AfterInsert()
     logInsert(){
        console.log("User inserted with id: " + this.id);
     }

     @AfterUpdate()
     logUpdate(){
        console.log("User updated with id: " + this.id);
     }

     @AfterRemove()
     logRemove(){
        console.log("User removed with id: " + this.id);
     }
}