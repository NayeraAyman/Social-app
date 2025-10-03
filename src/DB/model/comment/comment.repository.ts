import { AbstractRepository } from "../../abstarct.repository";
import { IComment } from "../../../utils";
import { commentModel } from "./comment.model";

export class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(commentModel);
    }
}