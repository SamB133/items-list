import { FC } from 'react';

const List: FC<{ numbered: boolean; children: any }> = ({
    numbered,
    children,
}) => {
    return (
        <div className="centered">
            {numbered ? <ol>{children}</ol> : <ul>{children}</ul>}
        </div>
    );
};

export default List;
