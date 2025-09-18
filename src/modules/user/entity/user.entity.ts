import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: false
})
export class User extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id_user: number;
    @Column({
        type: DataType.INTEGER
    })
    declare level: number;
    @Column({
        type: DataType.STRING
    })
    declare name: string;
    @Column({
        type: DataType.STRING
    })
    declare last_name: string;
    @Column({
        type: DataType.INTEGER
    })
    declare type: number;
    @Column({
        type: DataType.STRING
    })
    declare email: string;
    @Column({
        type: DataType.INTEGER
    })
    declare phone: number;
    @Column({
        type: DataType.STRING
    })
    declare photo: string;
    @Column({
        type: DataType.STRING
    })
    declare password: string;
    @Column({
        type: DataType.STRING
    })
    declare code_active: string;
    @Column({
        type: DataType.DATE
    })
    declare last_login: Date;
    @Column({
        type: DataType.INTEGER
    })
    declare is_social_login: number;
    @Column({
        type: DataType.INTEGER
    })
    declare is_google_login: number;
    @Column({
        type: DataType.INTEGER
    })
    declare is_facebook_login: number;
    @Column({
        type: DataType.INTEGER
    })
    declare is_apple_login: number;
    @Column({
        type: DataType.INTEGER
    })
    declare status: number;
    @Column({
        type:DataType.NUMBER
    })
    declare recovery:number;
}
