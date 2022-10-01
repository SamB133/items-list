export type Item = {
    id: number;
    description: string;
    complete: number;
};

export const fromRow = (item: any) => {
    return {
        id: item.id,
        description: item.description,
        complete: item.complete !== 0,
    };
};
