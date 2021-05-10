import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-toastify/dist/ReactToastify.css';




import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import App from './views/App/App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
