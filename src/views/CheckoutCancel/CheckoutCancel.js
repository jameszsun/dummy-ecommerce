import { useNavigate } from 'react-router-dom';
import { Container, Header, Icon, Segment, Button } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
	margin-top: 50px !important;
	text-align: center;
`;

const StyledSegment = styled(Segment)`
	padding: 50px !important;
`;

const CancelIcon = styled(Icon)`
	font-size: 64px !important;
	color: #db2828 !important;
	margin-bottom: 20px !important;
`;

export default function CheckoutCancel() {
	const navigate = useNavigate();

	return (
		<StyledContainer>
			<StyledSegment>
				<CancelIcon name="times circle" />
				<Header as="h1">Checkout Cancelled</Header>
				<p>Your payment was cancelled. Your cart has been preserved.</p>
				<Button.Group>
					<Button primary onClick={() => navigate('/cart')}>
						Return to Cart
					</Button>
					<Button onClick={() => navigate('/shop')}>
						Continue Shopping
					</Button>
				</Button.Group>
			</StyledSegment>
		</StyledContainer>
	);
}
