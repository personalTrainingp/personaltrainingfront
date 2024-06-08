import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
//import 'regenerator-runtime/runtime';

const container = document.getElementById('hyper');
if (container) {
	const root = createRoot(container);
	root.render(
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<App />
		</BrowserRouter>
	);
}
