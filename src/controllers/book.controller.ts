import {Body, Controller, Get, Patch, Path, Post, Route, Tags} from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import {AuthorDTO} from "../dto/author.dto";
import {Author} from "../models/author.model";
import {authorService} from "../services/author.service";
import {CustomError} from "../middlewares/errorHandler";
import {Book} from "../models/book.model";
import {toDto} from "../mapper/book.mapper";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  public async getAllBooks(): Promise<BookDTO[]> {
    return bookService.getAllBooks();
  }

    public async getBookById(id: number): Promise<BookDTO> {
        let book: Book | null = await bookService.getBookById(id);
        if (book === null){
            let error: CustomError = new Error("Book Not Found");
            error.status = 404;
            throw error;
        }
        return toDto(book);
    }

    @Post("/")
    public async createBook(
        @Body() requestBody: BookDTO
    ): Promise<BookDTO> {
        const {title, publishYear, author, isbn} = requestBody;
        if (author?.id === undefined){
            let error: CustomError = new Error("Author Not Found");
            error.status = 404;
            throw error;
        }

        return bookService.createBook(title, publishYear, author.id, isbn);
    }

    @Patch("{id}")
    public async updateBook(
        @Path() id: number,
        @Body() requestBody: BookDTO
    ): Promise<BookDTO | null> {

        let book: Book | null = await bookService.getBookById(id);
        if (book === null) {
            let error: CustomError = new Error("Book Not Found");
            error.status = 404;
            throw error;
        }
        const { title, publishYear, author, isbn } = requestBody;
        if (author?.id === undefined){
            let error: CustomError = new Error("Author Not Found");
            error.status = 404;
            throw error;
        }
        return bookService.updateBook(id, title, publishYear, author.id, isbn);

    }


}

