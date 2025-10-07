import NavItem from './NavItem';
import { NavLink } from 'react-router-dom';
import OutlineCartIcon from '../../assets/icons/outline-shopping-cart.svg';
import SolidCartIcon from '../../assets/icons/solid-shopping-cart.svg';
import OutlineBagIcon from '../../assets/icons/outline-shopping-bag.svg';
import SolidBagIcon from '../../assets/icons/solid-shopping-bag.svg';
import { Dropdown } from 'semantic-ui-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { HeaderMenu } from './nav-menu-styling';

const navProps = [
	{
		icon: {
			standard: OutlineBagIcon,
			active: SolidBagIcon,
		},
		linkTxt: 'Shop',
		to: '/shop',
		childType: 'link',
	},
	{
		icon: {
			standard: OutlineCartIcon,
			active: SolidCartIcon,
		},
		linkTxt: '',
		to: '/cart',
		childType: 'link',
	},
];

const UserMenuItem = styled.li`
	list-style: none;
	display: flex;
	align-items: center;
	padding: 0 10px;

	.ui.dropdown {
		color: inherit;
	}
`;

const TextNavItem = styled.li`
	list-style: none;
	display: flex;
	align-items: center;

	a {
		padding: 10px 15px;
		text-decoration: none;
		color: inherit;
		font-weight: 500;

		&:hover {
			opacity: 0.7;
		}

		&.nav-item--active {
			font-weight: 700;
		}
	}
`;

export default function NavMenu({ getTotalItemsInCart }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const NavItems = navProps.map((item, i) => {
		const { icon, activeIcon, linkTxt, to, childType } = item;
		return <NavItem
			icon={icon}
			activeIcon={activeIcon}
			getTotalItemsInCart={to === '/cart' ? getTotalItemsInCart : null}
			linkTxt={linkTxt}
			to={to}
			childType={childType}
			key={`nav-item-${i}`}
		/>
	});

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<HeaderMenu as='ul'>
			{NavItems}
			{user ? (
				<UserMenuItem>
					<Dropdown text={user.name || user.email} pointing>
						<Dropdown.Menu>
							<Dropdown.Item text="Orders" onClick={() => navigate('/orders')} />
							<Dropdown.Item text="Logout" onClick={handleLogout} />
						</Dropdown.Menu>
					</Dropdown>
				</UserMenuItem>
			) : (
				<>
					<TextNavItem>
						<NavLink to="/login" className={({ isActive }) => isActive ? 'nav-item--active' : undefined}>
							Login
						</NavLink>
					</TextNavItem>
					<TextNavItem>
						<NavLink to="/register" className={({ isActive }) => isActive ? 'nav-item--active' : undefined}>
							Register
						</NavLink>
					</TextNavItem>
				</>
			)}
		</HeaderMenu>
	)
}