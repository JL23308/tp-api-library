import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import {BookDTO} from "../dto/book.dto";
import {AuthorDTO} from "../dto/author.dto";
import {BookController} from "../controllers/book.controller";
import {AuthorService} from "./author.service";
import {CustomError} from "../middlewares/errorHandler";

class BookService {
    public authorService = new AuthorService();
  public async getAllBooks(): Promise<Book[]> {
    return Book.findAll({
        include: [{
            model: Author,
            as: 'author'
        }]
    });
  }

  public async getBookById(id: number): Promise<Book | null> {
      return Book.findByPk(id, {
          include: [{
              model: Author,
              as: 'author'
          }]
      });
  }

  public async createBook(
      title: string,
      publishYear: number,
      authorId: number,
      isbn: string,
  ): Promise<Book> {
      let author: Author | null = await this.authorService.getAuthorById(authorId);
      if(author === null) {
          let error: CustomError = new Error(`Author ${authorId} not found`);
          error.status = 404;
          throw error;
      }
      return Book.create({title, publishYear, authorId, isbn,});
  }

  public async updateBook(
      id: number,
      title: string,
      publishYear: number,
      authorId: number,
      isbn: string): Promise<Book | null> {
      const book = await Book.findByPk(id);
      if (book) {
          if (title) book.title = title;
          if (publishYear) book.publishYear = publishYear;
          if (isbn) book.isbn = isbn;
          if (authorId){
              let author: Author | null = await this.authorService.getAuthorById(authorId);
              if(author === null) {
                  let error: CustomError = new Error(`Author ${authorId} not found`);
                  error.status = 404;
                  throw error;
              }
              book.authorId = author.id;
          }
          await book.save();
          return book;
      }
      return null;
  }
}

export const bookService = new BookService();
