import { useRoutes } from 'react-router-dom';

import Home from '../views/Home';
import Cart from '../views/Cart';
import Shop from '../views/Shop';
import NotFound from '../views/NotFound';
import Product from '../views/Product';
import Login from '../views/Login';
import Register from '../views/Register';
import Orders from '../views/Orders';
import CheckoutSuccess from '../views/CheckoutSuccess';
import CheckoutCancel from '../views/CheckoutCancel';

export default function Page(props) {
	const {
		products,
		cart,
		itemsArrangerMethods,
		handleItemsArranger,
		mapDispatchToProps,
		getItemQty,
	} = props;

	const {
		addItemToCart,
		setCartItemQty,
		decrementItemQty,
		removeItemFromCart,
		resetCart,
	} = mapDispatchToProps;

	return useRoutes([
		{ path: '*', element: <NotFound /> },
		{ path: '/', element: <Home /> },
		{ path: '/login', element: <Login /> },
		{ path: '/register', element: <Register /> },
		{ path: '/orders', element: <Orders /> },
		{ path: '/checkout/success', element: <CheckoutSuccess resetCart={resetCart} /> },
		{ path: '/checkout/cancel', element: <CheckoutCancel /> },
		{
			path: '/shop',
			element: <Shop
				products={products}
				itemsArrangerMethods={itemsArrangerMethods}
				handleItemsArranger={handleItemsArranger}
				addItemToCart={addItemToCart}
				getItemQty={getItemQty}
			/>,
		},
		{
			path: '/cart',
			element: <Cart
				addItemToCart={addItemToCart}
				resetCart={resetCart}
				removeItemFromCart={removeItemFromCart}
				decrementItemQty={decrementItemQty}
				cart={cart}
			/>,
		},
		{
			path: '/shop/product/:id',
			element: <Product
				resetCart={resetCart}
				setCartItemQty={setCartItemQty}
				products={products}
				getItemQty={getItemQty}
			/>,
		},
	])
}