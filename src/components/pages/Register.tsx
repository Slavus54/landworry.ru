import {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {INITIAL_PERCENT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {Datus, time_format_min_border, time_format_max_border} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import CounterView from '../UI/CounterView'
import {createProfileM} from '../../graphql/profile/ProfileQueries'
import {TownType} from '../../types/types'

const Register = () => {
    const {change_context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [image, setImage] = useState<string>('')
    const [timer, setTimer] = useState<number>(time_format_min_border)
    const [idx, setIdx] = useState<number>(0)

    const datus = new Datus()

    const [state, setState] = useState({
        username: '', 
        password: '', 
        telegram: '',
        timestamp: '', 
        radius: INITIAL_PERCENT,
        region: towns[0].title, 
        cords: towns[0].cords
    })

    const centum = new Centum()

    const {username, password, telegram, timestamp, radius, region, cords} = state

    const [createProfile] = useMutation(createProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createProfile)
            change_context('update', data.createProfile, 1)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])
    
    useMemo(() => {
        setState({...state, timestamp: datus.time(timer)})
    }, [timer])

    const onCreate = () => {
        createProfile({
            variables: {
                username, password, telegram, timestamp, radius, region, cords, main_photo: image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Как вас зовут?</h4>
                        <input value={username} onChange={e => setState({...state, username: e.target.value})} placeholder='Введите имя' type='text' />

                        <CounterView num={timer} setNum={setTimer} part={30} min={time_format_min_border} max={time_format_max_border}>
                            Начало работы в {timestamp}
                        </CounterView>
                
                        <h4 className='pale'>Безопасность</h4>
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Ваш пароль' type='text' />  
                    </>,
                    <>
                        <h4 className='pale'>Связь через Telegram</h4>
                        <input value={telegram} onChange={e => setState({...state, telegram: e.target.value})} placeholder='Введите тег' type='text' />

                        <h4 className='pale'>Радиус: <b>{radius}</b> км</h4>
                        <input value={radius} onChange={e => setState({...state, radius: parseInt(e.target.value)})} type='range' step={1} />

                        <ImageLoader setImage={setImage} />
                    </>,
                    <>
                        <h4 className='pale'>Где вы находитесь?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h2>Новый Аккаунт</h2>
            </FormPagination>

            <button onClick={onCreate}>Создать</button>
        </div>
    )
}

export default Register