import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database";
import {Book} from "./book.model";
import {Author} from "./author.model"; // Connexion à la base de données

export enum State{
    damaged = 0,
    acceptableState = 1,
    goodState = 2,
    veryGoodState = 3,
    fresh = 4,
}

export interface BookCopyAttributes {
    id?: number;
    available: boolean;
    state: State,
    bookId: number;
    book?: Book;
}

export class BookCopy
  extends Model<BookCopyAttributes>
  implements BookCopyAttributes
{
    public id!: number;
    public available!: boolean;
    public state!: State;
    public bookId!: number;
    public book?: Book;
}

BookCopy.init(
  {
      id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      available:{
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: "available",
      },
      state:{
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "state",
      },
      bookId:{
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "book_id",
      }
  },
  {
    sequelize,
    tableName: "BookCopy",
  }
);

BookCopy.belongsTo(Book, { foreignKey: "bookId", as: "book" });