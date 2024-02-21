import React from 'react'
import NavigatorWrapper from '../router/NavigatorWrapper'

const Welcome: React.FC = () => {

    return (
        <>          
            <h1>Landworry.ru</h1>
            <h3 className='pale'>Приложение для ценителей ландшафта</h3>
            
            <NavigatorWrapper isRedirect={false} url='/register'>
                <button className='light-btn'>Начать</button>
            </NavigatorWrapper>
        </>
    )
}

export default Welcome