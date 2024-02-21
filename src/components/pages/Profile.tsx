import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {Datus} from 'datus.js'
import {TG_ICON, VIEW_CONFIG, token} from '../../env/env'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import ImageLook from '../UI/ImageLook'
import MapPicker from '../UI/MapPicker'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {getProfileM} from '../../graphql/pages/ProfilePageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Profile: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [dates, setDates] = useState<string[]>([])
    const [date, setDate] = useState<string>('')
    const [msg, setMsg] = useState<string>('')
    const [profile, setProfile] = useState<any | null>(null)
    const [services, setServices] = useState<any[]>([])
    const [service, setService] = useState<any | null>(null)

    const datus = new Datus()
    const centum = new Centum()

    const [getProfile] = useMutation(getProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (profile !== null) {
            setImage(profile.main_photo === '' ? ProfilePhoto : profile.main_photo)
            setCords(profile.cords)   
            setDates(datus.dates('day', 3))        
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onCopy = () => {
        let text = `
            Здравствуйте, ${profile.username}!
            На платформе Landworry.ru обнаружил вашу услугу: ${service.title}
            Моё сообщение вам: ${msg}
            
            Время: ${date} в ${profile.timestamp}
            Стоимость: ${service.cost}₽/час
        `
        
        window.navigator.clipboard.writeText(text)
    }

    const onView = () => {
        centum.go(profile.telegram, 'telegram')
    }

    return (
        <>          
            {profile !== null && profile.account_id !== context.account_id &&
                <>
                    {image !== '' && <ImageLook src={image} className='photo_item' alt='account photo' />}
                    <h1>{profile.username}</h1>

                    <div className='items small'>
                        <h4 className='pale'>Начало работы: <b>{profile.timestamp}</b></h4>
                        <h4 className='pale'>Радиус предоставляемых услуг: <b>{profile.radius}</b> км</h4>
                    </div>

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>  

                    {service === null ? 
                            <>
                                <DataPagination initialItems={profile.services} setItems={setServices} label='Услуги:' />
                                <div className='items half'>
                                    {services.map(el => 
                                        <div onClick={() => setService(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <h5 className='pale'><b>{el.category}</b></h5>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setService(null)} />

                                {service.image !== '' && <ImageLook src={service.image} min={16} max={16} className='photo_item' alt='service photo' />}

                                <h2>{service.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {service.category}</h4>
                                    <h4 className='pale'>Ставка: <b>{service.cost}₽</b>/час</h4>
                                </div>

                                <div className='items small'>
                                    {dates.map(el => <div onClick={() => setDate(el)} className={el === date ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder='Ваше сообщение...' />

                                <div className='items small'>
                                    <button onClick={onCopy}>Скопировать</button>
                                    <ImageLook onClick={onView} src={TG_ICON} min={2} max={2} className='icon' alt='tg-icon' />
                                </div>
                       
                            </>
                    }
                </>
            }
            {profile === null && <Loading />}
        </>
    )
}

export default Profile