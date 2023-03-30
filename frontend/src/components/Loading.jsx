import {BarLoader} from 'react-spinners';

const Loading = () => {

    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <BarLoader color="#ffffff" width='40%' />
        </div>
    )
}

export default Loading;