import {ObjectId} from "mongodb";

export type InsertedObject =
    {
        acknowledged: boolean
        insertedId : ObjectId
    }

export  type UpdatedObject =
    {
        matchedCount: number,
        modifiedCount: number,
        upsertedId: ObjectId,
        acknowledged: boolean
    }

export  type DeletedObject =
    {
        deletedCount: number,
        acknowledged: boolean
    }