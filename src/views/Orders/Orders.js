import { useState, useEffect } from 'react';
import { Container, Header, Segment, Loader, Message, Table, Image } from 'semantic-ui-react';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
	margin-top: 30px !important;
	margin-bottom: 50px !important;
`;

const OrderSegment = styled(Segment)`
	margin-bottom: 20px !important;
`;

const OrderHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
`;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Orders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const { token } = useAuth();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch(`${API_URL}/api/orders`, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch orders');
				}

				const data = await response.json();
				setOrders(data.orders);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [token]);

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
			<StyledContainer>
				<Loader active>Loading orders...</Loader>
			</StyledContainer>
		);
	}

	if (error) {
		return (
			<StyledContainer>
				<Message error>
					<Message.Header>Error</Message.Header>
					<p>{error}</p>
				</Message>
			</StyledContainer>
		);
	}

	if (orders.length === 0) {
		return (
			<StyledContainer>
				<Message info>
					<Message.Header>No Orders Yet</Message.Header>
					<p>You haven't placed any orders yet.</p>
				</Message>
			</StyledContainer>
		);
	}

	return (
		<StyledContainer>
			<Header as="h1">My Orders</Header>
			{orders.map((order) => (
				<OrderSegment key={order.id}>
					<OrderHeader>
						<div>
							<Header as="h3">Order #{order.id}</Header>
							<p>Placed on {formatDate(order.createdAt)}</p>
						</div>
						<div>
							<Header as="h3">${order.total}</Header>
							<p>Status: <strong>{order.status}</strong></p>
						</div>
					</OrderHeader>
					<Table basic="very">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Product</Table.HeaderCell>
								<Table.HeaderCell>Price</Table.HeaderCell>
								<Table.HeaderCell>Quantity</Table.HeaderCell>
								<Table.HeaderCell>Total</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{order.items.map((item) => {
								const discountedPrice = parseFloat(item.price) * (1 - parseFloat(item.discountPercentage) / 100);
								const itemTotal = discountedPrice * item.quantity;
								return (
									<Table.Row key={item.id}>
										<Table.Cell>
											<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
												<Image src={item.productThumbnail} size="mini" />
												<span>{item.productTitle}</span>
											</div>
										</Table.Cell>
										<Table.Cell>${discountedPrice.toFixed(2)}</Table.Cell>
										<Table.Cell>{item.quantity}</Table.Cell>
										<Table.Cell>${itemTotal.toFixed(2)}</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table>
				</OrderSegment>
			))}
		</StyledContainer>
	);
}
