import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import 'semantic-ui-less/semantic.less'
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = document.getElementById('root');
render(
	<Router>
		<AuthProvider>
			<App />
		</AuthProvider>
	</Router>
	, root);
