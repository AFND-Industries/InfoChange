import { useNavigate, useLocation } from 'react-router-dom';

export default function CoinInfo(props) {
    const { coin } = props;
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        navigate("/coins");
    }

    return (
        <div key={location.key}>
            <div className='row m-3'>
                <div className='col-md-6'>
                    <button className='btn btn-outline-primary' onClick={goBack}>
                        <i className="bi bi-x-lg me-2"></i>
                        <span className="d-sm-inline d-none">Volver</span>
                    </button>
                </div>
            </div>
        </div>
    )
}