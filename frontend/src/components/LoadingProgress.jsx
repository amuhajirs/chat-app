const LoadingProgress = ({ progress }) => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div style={{width: '40%'}}>
                <div className="w-100 text-center text-white fs-5 mb-3">Getting Data...</div>
                <div style={{
                    width: `${(progress || 0) * 100}%`,
                    background: 'white',
                    transition: 'width 50ms',
                    height: '5px',
                    borderRadius: '10px'
                }}></div>
                <div className="mt-2 text-center w-100 text-white fs-5">{progress * 100}%</div>
            </div>
        </div>
    )
}

export default LoadingProgress;