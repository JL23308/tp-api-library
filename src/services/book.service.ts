import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import {AuthorService} from "./author.service";
import {CustomError} from "../middlewares/errorHandler";
import {BookCopy} from "../models/bookCopy.model";

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
    public async deleteBook(id: number): Promise<void> {
        let countCopies = await BookCopy.findAndCountAll({ where: { bookId: id } });
        if(countCopies.count > 0) {
            let error: CustomError = new Error("Cannot delete book with associated copies");
            error.status = 409;
            throw error;
        }
        await Book.destroy({ where: { id } });
    }

    public async getBooksByAuthor(author: Author): Promise<Book[] | null> {
        return Book.findAll({where: {authorId: author.id}});
    }
}

export const bookService = new BookService();
