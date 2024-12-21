import React from 'react'

const Role = ({ role }) => {
    switch (role) {
        case "ceo":
            return "Ijrochi direktor"
            break;
        case "admin":
            return "Adminstrator"
        case "seller":
            return "Sotuvchi"
        default:
            break;
    }
}

export default Role