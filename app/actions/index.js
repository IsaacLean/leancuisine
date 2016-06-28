let nextTodoId = 0;
export const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};

export const setVisibilityFilter = (filter) => {
    return {
        filter,
        type: 'SET_VISIBILITY_FILTER'
    };
};

export const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};
