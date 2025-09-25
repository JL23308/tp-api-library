import {BookCopy} from "../models/bookCopy.model";
import {Book} from "../models/book.model";
import {bookService} from "./book.service";
import {CustomError} from "../middlewares/errorHandler";
import {Author} from "../models/author.model";

class BookCopyService{
    public async getAllBookCopies(): Promise<BookCopy[]>{
        return BookCopy.findAll({
            include: [{
                model: Book,
                as: 'book'
            }]
        })
    }

    public async getBookCopyById(id: number): Promise<BookCopy | null>{
        return BookCopy.findByPk(id, {
            include:[
                {
                    model: Book,
                    as: "book",
                }
            ]
        });
    }

    public async createBookCopy(
        available: boolean,
        state: number,
        bookId: number,
    ): Promise<BookCopy>{
        let bookCopy: Book | null = await bookService.getBookById(bookId);
        if (bookCopy === null){
            let error: CustomError = new Error(`Book ${bookId} not found`);
            error.status = 404;
            throw error;
        }
        return BookCopy.create({available, state, bookId})
    }

    public async updateBookCopy(
        id: number,
        available: boolean,
        state: number,
        bookId: number,
    ): Promise<BookCopy>{
        let bookCopy: BookCopy | null = await this.getBookCopyById(id)
        if (bookCopy) {
            if (available) bookCopy.available = available;
            if (state) bookCopy.state = state;
            if (bookId){
                let book: Book | null = await bookService.getBookById(bookId);
                if(book === null) {
                    let error: CustomError = new Error(`Book ${book} not found`);
                    error.status = 404;
                    throw error;
                }
                bookCopy.bookId = book.id;
            }
            await bookCopy.save();
            return bookCopy;
        }

        let error: CustomError = new Error(`BookCopy ${id} not found`);
        error.status = 404;
        throw error;
    }

    public async deleteBookCopy(id: number): Promise<void> {
        await BookCopy.destroy({ where: { id } });
    }

    public async getBookCopysByBookId(id: number): Promise<BookCopy[] | null> {
        return BookCopy.findAll({where: {bookId: id}});
    }
}
export const bookCopyService = new BookCopyService();