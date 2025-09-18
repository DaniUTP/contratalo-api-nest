import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'user_firebases',
    timestamps: false
})
export class UserFirebases extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id_user_firebase: number;
    @Column({
        type: DataType.INTEGER
    })
    declare id_user: number;
    @Column({
        type: DataType.STRING
    })
    declare token_firebase: string;
    @Column({
        type: DataType.INTEGER
    })
    declare status: number;
}
