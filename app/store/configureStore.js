import { createStore } from 'redux';

export default function configureStore(reducer) {
    const store = createStore(reducer);

    return store;
}
