// React Imports 
import React from 'react';
import ReactDOM from 'react-dom';
// Prime React Imports
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
// Redux Imports
import { connect, Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
// Styling Imports
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import './styles.scss';
// Import App Component
import App from './views/App/App';





const mapStateToProps = (state) => {
    return {
        state,
    };
};

const AppComponent = () => <App />;
const ReduxContainer = connect(mapStateToProps)(AppComponent);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ReduxContainer />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
