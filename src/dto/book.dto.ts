import { AuthorDTO } from "./author.dto";
import {BookCopyDTO} from "./bookCopy.dto";

export interface BookDTO {
  id?: number;
  title: string;
  publishYear: number;
  author?: AuthorDTO;
  isbn: string;
}
