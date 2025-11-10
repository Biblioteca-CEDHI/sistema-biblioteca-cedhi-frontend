// action - state management
import { REGISTER, LOGIN, LOGOUT } from './actions';

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: action.payload.isInitialized ?? true,
        user: action.payload.user
      };
    }

    case LOGOUT: {
      return {
        ...state,
        isInitialized: action.payload?.isInitialized ?? true,
        isLoggedIn: false,
        //isInitialized: true,
        user: null
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
