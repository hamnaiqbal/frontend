import { ProgressSpinner } from 'primereact/progressspinner';
import { ToastContainer } from 'react-toastify';
import AppRouter from '../AppRouter/AppRouter';
import Header from '../../components/Header/Header';
import './App.scss';

function App() {
    return (
        <div className="App">
            <ToastContainer />

            <div className="progress-div loader">
                <ProgressSpinner />
            </div>

            <Header />

            <div className="main-app-content">
                <AppRouter />
            </div>
        </div>
    );
}

export default App;
