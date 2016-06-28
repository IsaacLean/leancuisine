import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import rootReducer from './reducers/index';

import TodoApp from './components/TodoApp';

let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

ReactDOM.render(
    <Provider store={configureStore(rootReducer)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);
