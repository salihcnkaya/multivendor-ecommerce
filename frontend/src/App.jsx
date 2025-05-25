import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthForm from './pages/AuthForm';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Vendor from './pages/Vendor';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ManageOrders from './pages/ManageOrders';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';
import DashboardLayout from './layouts/DashboardLayout';
import ApproveProduct from './pages/ApproveProduct';
import VendorPage from './pages/VendorPage';
import AccountDetails from './pages/AccountDetails';
import Checkout from './pages/Checkout';

import { useCartContext } from './context/CartContext';
import MyOrders from './pages/MyOrders';

const ProtectedCheckoutRoute = ({ children }) => {
	const { cart } = useCartContext();

	if (!cart || !cart.items || cart.items.length === 0) {
		return <Navigate to="/" replace />;
	}

	return children;
};

const ProtectedRoute = ({ children, role }) => {
	const { isAuthenticated, isCheckingAuth, user } = useAuth();

	if (isCheckingAuth) {
		return (
			<div className="h-screen w-screen flex justify-center items-center">
				<Spinner />
			</div>
		);
	}

	if (!isAuthenticated) {
		let redirectPath = '/auth/giris-yap';
		if (role === 'vendor') {
			redirectPath = '/auth/satici/giris-yap';
		} else if (role === 'admin') {
			redirectPath = '/auth/admin/giris-yap';
		}

		return <Navigate to={redirectPath} replace />;
	}

	if (isAuthenticated && role !== user.role) {
		return <Navigate to="/" replace />;
	}

	return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuth();

	if (isAuthenticated && user) {
		if (user.role === 'user') {
			return <Navigate to="/" replace />;
		}
		if (user.role === 'vendor') {
			return <Navigate to="/satici" replace />;
		}
		if (user.role === 'admin') {
			return <Navigate to="/admin" replace />;
		}
	}
	return children;
};

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="sepet" element={<Cart />} />
				<Route
					path="odeme"
					element={
						<ProtectedCheckoutRoute>
							<Checkout />
						</ProtectedCheckoutRoute>
					}
				/>
				<Route path="/:slug" element={<ProductDetails />} />
				<Route path="/magaza/:slug" element={<VendorPage />} />
				<Route
					path="/uyelik-bilgilerim"
					element={
						<ProtectedRoute role="user">
							<AccountDetails />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/siparislerim"
					element={
						<ProtectedRoute role="user">
							<MyOrders />
						</ProtectedRoute>
					}
				/>
			</Route>

			<Route
				path="/auth"
				element={
					<RedirectAuthenticatedUser>
						<AuthLayout />
					</RedirectAuthenticatedUser>
				}
			>
				<Route
					path="giris-yap"
					element={<AuthForm formType="login" role="user" />}
				/>
				<Route
					path="kayit-ol"
					element={<AuthForm formType="register" role="user" />}
				/>
				<Route
					path="satici/giris-yap"
					element={<AuthForm formType="login" role="vendor" />}
				/>
				<Route
					path="satici/kayit-ol"
					element={<AuthForm formType="register" role="vendor" />}
				/>
				<Route
					path="admin/giris-yap"
					element={<AuthForm formType="login" role="admin" />}
				/>
				<Route
					path="admin/kayit-ol"
					element={<AuthForm formType="register" role="admin" />}
				/>
			</Route>

			<Route
				path="/satici"
				element={
					<ProtectedRoute role="vendor">
						<DashboardLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Vendor />} />
				<Route path="urun-ekle" element={<AddProduct />} />
				<Route path="urun-duzenle" element={<EditProduct />} />
				<Route path="siparisler" element={<ManageOrders />} />
			</Route>
			<Route
				path="/admin"
				element={
					<ProtectedRoute role="admin">
						<DashboardLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Vendor />} />
				<Route path="urun-onayla" element={<ApproveProduct />} />
				<Route path="urun-duzenle" element={<EditProduct />} />
				<Route path="siparisler" element={<ManageOrders />} />
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
