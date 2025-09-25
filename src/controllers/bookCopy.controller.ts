import {Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags} from "tsoa";
import {bookCopyService} from "../services/bookCollection.service";
import {BookCopyDTO} from "../dto/bookCopy.dto";
import {BookCopy} from "../models/bookCopy.model";
import {CustomError} from "../middlewares/errorHandler";


@Route("bookCopys")
@Tags("BookCopys")
@Security("jwt", ["read", "write"])
export class BookCopyController extends Controller {
    @Get("/")
    public async getAllBookCopies(): Promise<BookCopyDTO[]> {
        return bookCopyService.getAllBookCopies();
    }

    @Get("/{id}")
    public async getBookById(id: number): Promise<BookCopyDTO> {
        let bookCopy: BookCopy | null = await bookCopyService.getBookCopyById(id);
        if (bookCopy === null){
            let error: CustomError = new Error("BookCopy Not Found");
            error.status = 404;
            throw error;
        }
        return bookCopy;
    }

    @Post("/")
    @Security("jwt", ["create:BookCopy"])
    public async createBook(
        @Body() requestBody: BookCopyDTO
    ): Promise<BookCopyDTO> {
        const {available, state, book} = requestBody;
        if (book?.id === undefined){
            let error: CustomError = new Error("Book Not Found");
            error.status = 404;
            throw error;
        }

        return bookCopyService.createBookCopy(available, state, book.id);
    }

    @Patch("{id}")
    @Security("jwt", ["update:BookCopy"])
    public async updateBook(
        @Path() id: number,
        @Body() requestBody: BookCopyDTO
    ): Promise<BookCopyDTO>{
        const {available, state, book} = requestBody;
        if (book?.id === undefined){
            let error: CustomError = new Error(`Book not found`);
            error.status = 404;
            throw error;
        }

        return bookCopyService.updateBookCopy(id, available, state, book.id);
    }

    @Delete("{id}")
    @Security("jwt", ["delete:BookCopy"])
    public async deleteBookCopy(@Path() id: number): Promise<void> {
        await bookCopyService.deleteBookCopy(id);
    }
}
