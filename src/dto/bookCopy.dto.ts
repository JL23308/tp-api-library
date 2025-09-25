import {AuthorDTO} from "./author.dto";
import {Book} from "../models/book.model";
import {BookDTO} from "./book.dto";
import {State} from "../models/bookCopy.model"

export interface BookCopyDTO {
    id?: number;
    available: boolean;
    state: State;
    book?: BookDTO;
}