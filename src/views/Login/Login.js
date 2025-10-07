import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Message, Segment, Header, Container } from 'semantic-ui-react';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
	margin-top: 50px !important;
	max-width: 450px !important;
`;

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(email, password);
			navigate('/shop');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<StyledContainer>
			<Segment>
				<Header as="h2" textAlign="center">Login</Header>
				<Form onSubmit={handleSubmit} error={!!error}>
					<Form.Field>
						<label>Email</label>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Field>
					<Form.Field>
						<label>Password</label>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Form.Field>
					{error && <Message error content={error} />}
					<Button type="submit" primary fluid loading={loading}>
						Login
					</Button>
				</Form>
				<Message>
					Don't have an account? <Link to="/register">Register</Link>
				</Message>
			</Segment>
		</StyledContainer>
	);
}
