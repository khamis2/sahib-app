import * as fs from 'fs';
import * as path from 'path';

export class SimpleJsonDb<T extends { id: string }> {
    private filePath: string;
    private data: T[] = [];

    constructor(collectionName: string) {
        this.filePath = path.join(process.cwd(), `db_${collectionName}.json`);
        this.load();
    }

    private load() {
        if (fs.existsSync(this.filePath)) {
            const raw = fs.readFileSync(this.filePath, 'utf-8');
            try {
                this.data = JSON.parse(raw);
            } catch (e) {
                this.data = [];
            }
        }
    }

    private save() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    }

    async find(filter?: Partial<T>): Promise<T[]> {
        if (!filter) return this.data;
        return this.data.filter(item => {
            return Object.entries(filter).every(([key, value]) => item[key as keyof T] === value);
        });
    }

    async findOne(filter: Partial<T>): Promise<T | undefined> {
        return this.data.find(item => {
            return Object.entries(filter).every(([key, value]) => item[key as keyof T] === value);
        });
    }

    async saveOne(item: T): Promise<T> {
        const index = this.data.findIndex(i => i.id === item.id);
        if (index >= 0) {
            this.data[index] = item;
        } else {
            this.data.push(item);
        }
        this.save();
        return item;
    }

    async delete(id: string): Promise<void> {
        this.data = this.data.filter(i => i.id !== id);
        this.save();
    }
}
