import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { toast } = useToast();

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('hostia_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart from local storage:', error);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('hostia_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (plan) => {
        setCartItems((prevItems) => {
            // Check if item already exists (optional: allow duplicates or not? Usually for hosting, duplicates might be separate instances)
            // For now, let's allow duplicates but maybe warn or just add it.
            // Actually, let's just add it as a new item.
            const newItem = { ...plan, cartId: Date.now() + Math.random() };

            toast({
                title: "Added to cart",
                description: `${plan.name} has been added to your cart.`
            });

            return [...prevItems, newItem];
        });
    };

    const removeFromCart = (cartId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.cartId !== cartId));
        toast({
            title: "Removed from cart",
            description: "Item has been removed from your cart."
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + Number(item.price), 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
