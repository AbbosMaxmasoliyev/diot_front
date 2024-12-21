import { removeToken } from '../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;