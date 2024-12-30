import React from 'react'

const DetailLine = ({ name, value }) => {
    return (
        <div className="line-container">
            <span>{name}</span>
            <div className="line"></div>
            <span>{value}</span>
        </div>
    )
}

export default DetailLine