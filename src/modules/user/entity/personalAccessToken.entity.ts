import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'personal_access_token',
    timestamps: false
})
export class PersonalAccessToken extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id_personal_access_token: number;
    @Column({
        type: DataType.INTEGER
    })
    declare id_user: number;
    @Column({
        type: DataType.STRING
    })
    declare token: string;
    @Column({
        type: DataType.STRING
    })
    declare status: string;
}
