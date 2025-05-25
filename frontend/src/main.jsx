import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
	// <StrictMode>
	<BrowserRouter>
		<AuthProvider>
			<ProductProvider>
				<CartProvider>
					<App />
				</CartProvider>
			</ProductProvider>
		</AuthProvider>
	</BrowserRouter>
	// </StrictMode>
);
