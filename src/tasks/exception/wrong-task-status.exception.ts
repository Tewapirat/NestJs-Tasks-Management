export class WrongTaskStatusException extends Error {
    constructor() {
        super('Wrong task status transition attempted');
        this.name = 'WrongTaskStatusException';
    }
}