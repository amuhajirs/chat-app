const Rooms = () => {
    return (
        <div className='search d-flex justify-content-between align-items-center px-2 py-2 gap-1' style={{height: '60px'}}>
            <div className='position-relative w-100'>
                <label htmlFor="search" className='position-absolute top-50 unselectable' style={{left: '15px', translate: '0 -50%'}}>
                    <i className="fa-solid fa-magnifying-glass text-secondary" style={{fontSize: '15px'}}></i>
                </label>
                <input type="search" id='search' className='input-theme ps-5' placeholder='Search' style={{fontSize: '15px', padding: '7px'}} />
            </div>
            <button className='cool-btn'>
                <i className="fa-solid fa-plus unselectable" style={{fontSize: '15px'}}></i>
            </button>
        </div>
    )
}

export default Rooms;