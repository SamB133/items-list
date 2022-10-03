import { useState, useRef, useEffect, FC } from 'react';
import ListItem, { ListItemType } from './ListItem';
import List from './List';
import produce from 'immer';

const App: FC = () => {
    const [listItems, setListItems] = useState<ListItemType[]>([]);
    const [numbered, setNumbered] = useState(false);
    const itemRef = useRef<HTMLInputElement>(null);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const localStorageItemsKey = 'listApp.listItems';
    const localStorageOrderedKey = 'listApp.listOrdered';

    useEffect(() => {
        fetchList();
        if (localStorage.getItem(localStorageOrderedKey) == null) {
            return;
        } else {
            const storedListOrdered: boolean = JSON.parse(
                localStorage.getItem(localStorageOrderedKey) as string,
            );
            if (storedListOrdered) setNumbered(storedListOrdered);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(localStorageItemsKey, JSON.stringify(listItems));
    }, [listItems]);

    useEffect(() => {
        localStorage.setItem(localStorageOrderedKey, JSON.stringify(numbered));
    }, [numbered]);

    function addItem() {
        if (itemRef.current) {
            if (itemRef.current.value.length <= 75) {
                const description = itemRef.current.value;
                if (description === '') return;
                fetch(`/api/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ description }),
                })
                    .then((response) => response.json())
                    .then((newItem) => {
                        setListItems(
                            produce(listItems, (newListItems) => {
                                newListItems.push({
                                    id: Math.random(),
                                    description,
                                    complete: false,
                                });
                            }),
                        );
                    })
                    .catch((error) => {
                        console.error('Error: ', error);
                    });
                itemRef.current.value = '';
            } else if (itemRef.current.value.length > 75) {
                alert('Error: 75 character limit exceeded. Please try again.');
                itemRef.current.value = '';
            }
        }
        fetchList();
    }

    function complete(index: number) {
        let newItem = produce(listItems[index], (newItem) => {
            newItem.complete = !newItem.complete;
        });
        fetch(`/api/items/${newItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        })
            .then((response) => response.json())
            .then(() => {
                setListItems(
                    produce(listItems, (newListItems) => {
                        newListItems[index].complete =
                            !newListItems[index].complete;
                    }),
                );
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
        fetchList();
    }

    function deleteItem(id: number) {
        fetch(`/api/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(() => {
                setListItems(listItems.filter((item) => item.id !== id));
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
        fetchList();
    }

    function deleteCompleted() {
        listItems.forEach((item) => {
            if (item.complete) {
                fetch(`/api/items/${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .catch((error) => {
                        console.error('Error: ', error);
                    });
            }
        });
    }

    function fetchList() {
        fetch('/api/items')
            .then((response) => response.json())
            .then((data) => setListItems(data));
        setListItems(listItems.filter((item) => !item.complete));
    }

    return (
        <div className="centered">
            <div>
                <button
                    className="buttonsInput"
                    onClick={() => setNumbered(!numbered)}
                >
                    Change List Type (Bullets or Numbers)
                </button>
            </div>
            <div>
                <input
                    className="buttonsInput"
                    type="text"
                    ref={itemRef}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') addButtonRef.current?.click();
                    }}
                />
            </div>
            <button
                className="buttonsInput"
                style={{ color: 'green' }}
                onClick={addItem}
                ref={addButtonRef}
            >
                Add Item to List
            </button>
            <button
                className="buttonsInput"
                style={{ color: 'red' }}
                onClick={deleteCompleted}
            >
                Delete Completed Items
            </button>
            <div className="text">
                You have {listItems.length} items in your list
            </div>
            <List numbered={numbered}>
                {listItems.map((item, index) => (
                    <ListItem
                        key={item.id}
                        item={item}
                        onClickItem={() => complete(index)}
                        onDeleteItem={() => deleteItem(item.id)}
                    />
                ))}
            </List>
        </div>
    );
};

export default App;
