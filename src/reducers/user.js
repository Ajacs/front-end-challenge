import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    first_name: '',
    last_name: '',
    dark_theme: true,
    fetching: false,
    error: false,
    errorMessage: ''
});

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_ACCOUNT_REQUEST':
            return state.merge({
                fetching: true
            });
        default:
            return state
    }
};

export default userReducer;