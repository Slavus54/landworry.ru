import React, {useContext} from 'react'
import Welcome from '../pages/Welcome'
import AccountPage from '../pages/AccountPage'
import {Context} from '../../context/WebProvider'

const Home: React.FC = () => {
    const {context} = useContext(Context)
    
    return (
        <>
            {context.account_id === '' ? <Welcome /> : <AccountPage />}  
        </>
    )
}

export default Home