import { FC, useState } from 'react';
import { useDrag } from 'react-use-gesture';

export type ListItemType = {
    id: number;
    description: string;
    complete: boolean;
};

type ItemListProps = {
    item: ListItemType;
    onClickItem: VoidFunction;
    onDeleteItem: VoidFunction;
};

const ListItem: FC<ItemListProps> = ({ item, onClickItem, onDeleteItem }) => {
    const [viewDeleteButton, setViewDeleteButton] = useState(false);
    const bind = useDrag((state) => {
        if (state.dragging && state.axis === 'x') {
            if (state.direction[0] === -1) {
                setViewDeleteButton(true);
                setTimeout(setViewDeleteButton, 8000);
            } else if (state.direction[0] === 1) {
                setViewDeleteButton(false);
            }
        }
    });

    return (
        <li key={item.id} {...bind()}>
            <span
                onClick={onClickItem}
                className={
                    viewDeleteButton
                        ? item.complete
                            ? 'itemCompleted text spanWithDelete'
                            : 'itemIncomplete text spanWithDelete'
                        : item.complete
                        ? 'itemCompleted text'
                        : 'itemIncomplete text'
                }
            >
                {item.description}
            </span>
            {viewDeleteButton && (
                <button className="singleDelete viewing" onClick={onDeleteItem}>
                    Delete
                </button>
            )}
        </li>
    );
};

export default ListItem;
