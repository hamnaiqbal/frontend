import { ProgressSpinner } from 'primereact/progressspinner';
import { ToastContainer } from 'react-toastify';
import AppRouter from '../AppRouter/AppRouter';
import './App.scss';

function App() {
    return (
        <div className="App">
            <ToastContainer />

            <div className="progress-div loader">
                <ProgressSpinner />
            </div>
            <div>
                <AppRouter />
            </div>
        </div>
    );
}

export default App;
