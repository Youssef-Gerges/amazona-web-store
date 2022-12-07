import React, { createContext, useReducer } from 'react';
import ProductInterface from '../interfaces/product.interface';
import Cookies from 'js-cookie';

export type cartType = {
  cart?: {
    cartItems: ProductInterface[];
    shippingAddress?: {};
    paymentMethod?: string;
  };
};

type cartActionType = {
  type: string;
  payload?: any;
};

const initialState: cartType = {
  cart: Cookies.get('cart')
    ? JSON.parse(String(Cookies.get('cart')))
    : { cartItems: [] },
};

export const Store = createContext<cartType>(initialState);

function reducer(state: cartType, action: cartActionType) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart?.cartItems.find(
        (item: ProductInterface) => item.slug === newItem?.slug
      );
      const cartItems = existItem
        ? state.cart?.cartItems?.map((item: ProductInterface) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart?.cartItems, newItem];

      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart?.cartItems.filter(
        (item) => item.slug !== action.payload?.slug
      );
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_RESET_ACTION': {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    }
    case 'CART_CLEAR_ITEMS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };
    }

    case 'SAVE_SHIPPING_ADDRESS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart?.shippingAddress,
            ...action.payload,
          },
        },
      };
    }

    case 'SAVE_PAYMENT_METHOD': {
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }

    default:
      return state;
  }
}

export const StoreProvider: React.FC<{ children: any }> = ({ children }) => {
  const [state, dispatch] = useReducer<cartActionType, cartType>(
    reducer,
    initialState
  );
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
};
