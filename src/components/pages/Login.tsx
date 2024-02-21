import {useState, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {Context} from '../../context/WebProvider'
import {loginProfileM} from '../../graphql/profile/ProfileQueries'

const Login = () => {
    const {change_context} = useContext(Context)
    const [state, setState] = useState({
        password: ''
    })

    const {password} = state   

    const [loginProfile] = useMutation(loginProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.loginProfile)
            change_context('update', data.loginProfile, 3)
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                password
            }
        })
    }

    return (
        <div className='main'>
            <h1>Войдите в аккаунт</h1>
            <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Ваш пароль' type='text' />           

            <button onClick={onLogin}>Войти</button>
        </div>
    )
}

export default Login