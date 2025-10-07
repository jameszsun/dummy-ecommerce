import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Header, Icon, Segment, Button } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
	margin-top: 50px !important;
	text-align: center;
`;

const StyledSegment = styled(Segment)`
	padding: 50px !important;
`;

const SuccessIcon = styled(Icon)`
	font-size: 64px !important;
	color: #21ba45 !important;
	margin-bottom: 20px !important;
`;

export default function CheckoutSuccess({ resetCart }) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get('session_id');

	useEffect(() => {
		// Clear the cart after successful checkout
		if (sessionId) {
			resetCart();
		}
	}, [sessionId, resetCart]);

	return (
		<StyledContainer>
			<StyledSegment>
				<SuccessIcon name="check circle" />
				<Header as="h1">Payment Successful!</Header>
				<p>Thank you for your purchase. Your order has been confirmed.</p>
				<p>You can view your order details in your orders page.</p>
				<Button.Group>
					<Button primary onClick={() => navigate('/orders')}>
						View Orders
					</Button>
					<Button onClick={() => navigate('/shop')}>
						Continue Shopping
					</Button>
				</Button.Group>
			</StyledSegment>
		</StyledContainer>
	);
}
