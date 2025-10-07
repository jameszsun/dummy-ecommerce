import { useState } from 'react';
import { Button, Header, Segment, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';

const StyledCheckout = styled(Segment)`
	display: flex;
	flex-direction: column;
	& > .header {
		margin: 0!important;
	}
	& dt {
		text-align: right;
		width: max-content;
	}
	& dl {
		display: flex;
		justify-content: space-between;
		gap: 2px 4px;
		border-top: 1px solid rgba(0, 0, 0, 0.2);
		padding: 3px 0;
	}
	& dd {
		width: max-content;
	}
`

export const ItemCount = styled.div`
color: gray;
font-weight: 300;
`

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Checkout({ totalCost, getTotalItems, cart }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { user, token } = useAuth();
	const navigate = useNavigate();

	const handleCheckout = async () => {
		if (!user) {
			navigate('/login');
			return;
		}

		if (!cart || cart.length === 0) {
			setError('Your cart is empty');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await fetch(`${API_URL}/api/checkout/create-session`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ cartItems: cart }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to create checkout session');
			}

			const { url } = await response.json();
			window.location.href = url;
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	return (
		<StyledCheckout>
			<Header>Estimated Costs</Header>
			<dl>
				<dt>SubTotal:
					<ItemCount>
						{`(${getTotalItems()} items)`}
					</ItemCount>
				</dt>
				<dd>{` $${totalCost}`}</dd>
			</dl>
			<p>No tax included</p>
			<dl>
				<dt>Estimated Total:</dt>
				<dd>
					<strong>
						{` $${totalCost}`}
					</strong>
				</dd>
			</dl>
			{error && <Message error content={error} />}
			<Button primary loading={loading} onClick={handleCheckout}>
				{user ? 'Continue to checkout' : 'Login to checkout'}
			</Button>
		</StyledCheckout>
	)
}