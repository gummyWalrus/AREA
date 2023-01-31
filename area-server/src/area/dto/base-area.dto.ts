export class BaseAreaDto {
    name: string;
    description: string;
    owner: string;
    action : {
        id : string;
        data : object;
    }
    reaction: {
        id: string;
        data: object;
    }
}