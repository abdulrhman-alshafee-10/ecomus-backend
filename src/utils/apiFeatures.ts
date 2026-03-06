import { Query } from 'mongoose';

interface QueryString {
    page?: string;
    limit?: string;
    sort?: string;
    fields?: string;
    keyword?: string;
    [key: string]: string | undefined;
}

export class ApiFeatures<T> {
    query: Query<T[], T>;
    queryStr: QueryString;

    constructor(query: Query<T[], T>, queryStr: QueryString) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(): this {
        const queryObj = { ...this.queryStr };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
        excludedFields.forEach((f) => delete queryObj[f]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search(fields: string[]): this {
        if (this.queryStr.keyword) {
            const regex = new RegExp(this.queryStr.keyword, 'i');
            const searchConditions = fields.map((f) => ({ [f]: regex }));
            this.query = this.query.find({ $or: searchConditions } as any);
        }
        return this;
    }

    sort(): this {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(): this {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate(): this {
        const page = parseInt(this.queryStr.page || '1', 10);
        const limit = parseInt(this.queryStr.limit || '12', 10);
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
