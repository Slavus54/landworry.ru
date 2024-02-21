import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {CLEANING_TYPES, LEVELS, SUBJECTS, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {Datus, time_format_min_border, time_format_max_border} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import CounterView from '../UI/CounterView'
import {ModernAlert} from '../UI/ModernAlert'
import {createCleaningM} from '../../graphql/pages/CleaningPageQueries'
import {CollectionPropsType, Cords, TownType} from '../../types/types'

const CreateCleaning: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())

    const datus = new Datus()

    const [timer, setTimer] = useState<number>(time_format_min_border)
    const [idx, setIdx] = useState<number>(0)
    const [isStartCords, setIsStartCords] = useState<boolean>(true)
    const [dates] = useState<string[]>(datus.dates('day', 3))

    const [state, setState] = useState({
        title: '', 
        category: CLEANING_TYPES[0], 
        level: LEVELS[0], 
        dateUp: dates[0], 
        time: datus.time(timer),
        region: towns[0].title, 
        cords: towns[0].cords,
        dots: [], 
        distance: 0,
        discussion: '', 
        subject: SUBJECTS[0]
    })

    const centum = new Centum()

    const {title, category, level, dateUp, time, region, cords, dots, distance, discussion, subject} = state

    const [createCleaning] = useMutation(createCleaningM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createCleaning)
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
        if (dots.length > 0) {
            let latest = dots[dots.length - 1]

            setView({...view, latitude: latest.lat, longitude: latest.long, zoom: 16})
        }
    }, [dots])

    useMemo(() => {
        setState({...state, time: datus.time(timer)})
    }, [timer])
    
    const onSetRoute = e => {
        let result: Cords = centum.mapboxCords(e)
        let latest = dots.length === 0 ? cords : dots[dots.length - 1]

        if (isStartCords) {
            setState({...state, cords: result})
        } else {
            let size: number = centum.haversine([latest.lat, latest.long, result.lat, result.long], 1) 

            setState({...state, dots: [...dots, result], distance: distance + size})
        }
    }

    const onCreate = () => {
        createCleaning({
            variables: {
                username: context.username, id, title, category, level, dateUp, time, region, cords, dots, distance, discussion, subject
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Название</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название мероприятия...' />
                
                        <h4 className='pale'>Пространство</h4>
                        <div className='items small'>
                            {CLEANING_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>       

                        <CounterView num={timer} setNum={setTimer} part={30} min={time_format_min_border} max={time_format_max_border}>
                            Начало в {time}    
                        </CounterView>              
                    </>,
                    <>
                        <h4 className='pale'>Уровень загрязнения и область ответственности</h4>
                        <div className='items small'>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={subject} onChange={e => setState({...state, subject: e.target.value})}>
                                {SUBJECTS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>

                        <textarea value={discussion} onChange={e => setState({...state, discussion: e.target.value})} placeholder='Тема для дискуссии...' />

                        <h4 className='pale'>Выберите дату</h4>
                        <div className='items small'>
                            {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={el === dateUp ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                    </>,
                    <>
                        <h4 className='pale'>Где будет {isStartCords ? 'начало' : 'продолжение'} маршрута?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
                      
                        <ReactMapGL onClick={e => onSetRoute(e)} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='home' />
                            </Marker>
                            
                            {dots.map(el => 
                                <Marker latitude={el.lat} longitude={el.long}>
                                    <MapPicker type='picker' />
                                </Marker>
                            )}
                        </ReactMapGL>  

                        <h4 className='pale'>Дистанция: <b>{distance}</b> м</h4>
                        {isStartCords ? <button onClick={() => setIsStartCords(false)} className='light-btn'>Закрепить</button> : <button onClick={onCreate}>Создать</button>}
                    </>
                ]} 
            >
                <h2>Новая Чистка</h2>
            </FormPagination>
        </div>
    )
}

export default CreateCleaning