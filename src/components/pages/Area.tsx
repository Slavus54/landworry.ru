import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {NEED_TYPES, DEFAULT_NEED_COST, ARCHITECTURES, INITIAL_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {getAreaM, updateAreaInfoM, makeAreaBuildingM, manageAreaNeedM} from '../../graphql/pages/AreaPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Area: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [photo, setPhoto] = useState<string>('')
    const [area, setArea] = useState<any | null>(null)
    const [needs, setNeeds] = useState<any[]>([])
    const [need, setNeed] = useState<any | null>(null)
    const [buildings, setBuildings] = useState<any[]>([])
    const [building, setBuilding] = useState<any | null>(null)
    const [state, setState] = useState({
        text: '',
        category: NEED_TYPES[0],
        cost: DEFAULT_NEED_COST,
        title: '',
        architecture: ARCHITECTURES[0],
        rating: INITIAL_PERCENT
    })

    const centum = new Centum()

    const {text, category, cost, title, architecture, rating} = state

    const [getArea] = useMutation(getAreaM, {
        optimisticResponse: true,
        onCompleted(data) {
            setArea(data.getArea)
        }
    })

    const [updateAreaInfo] = useMutation(updateAreaInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateAreaInfo)
        }
    })

    const [makeAreaBuilding] = useMutation(makeAreaBuildingM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.makeAreaBuilding)
        }
    })

    const [manageAreaNeed] = useMutation(manageAreaNeedM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageAreaNeed)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getArea({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (area !== null) {
            setCords(area.cords)

            setState({...state, rating: area.rating})
        }
    }, [area])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onUpdateInfo = () => {
        updateAreaInfo({
            variables: {
                username: context.username, id, rating
            }
        })
    }

    const onMakeBuilding = () => {
        makeAreaBuilding({
            variables: {
                username: context.username, id, title, architecture, cords, photo
            }
        })
    }

    const onManageNeed = (option: string) => {
        manageAreaNeed({
            variables: {
                username: context.username, id, option, text, category, cost, coll_id: need === null ? '' : need.shortid
            }
        })
    }

    return (
        <>          
            {area !== null &&
                <>
                    <h2>{area.title}</h2>

                    <div className='items half'>
                        <h4 className='pale'>Категория: {area.category}</h4>
                        <h4 className='pale'>Собственность: {area.format}</h4>
                    </div>

                    <h4 className='pale'>Ухоженность: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateInfo} className='light-btn'>Обновить</button>

                    {building === null ? 
                            <>
                                <h2>Новое Здание</h2>

                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название постройки' type='text' />

                                <select value={architecture} onChange={e => setState({...state, architecture: e.target.value})}>
                                    {ARCHITECTURES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setPhoto} />

                                <button onClick={onMakeBuilding}>Добавить</button>

                                <DataPagination initialItems={area.buildings} setItems={setBuildings} label='Карта строений:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setBuilding(null)} />
                            
                                {building.photo !== '' && <ImageLook src={building.photo} className='photo_item' alt='building photo' />}

                                <h2>{building.title}</h2>

                                <h4 className='pale'>Стиль: {building.architecture}</h4>
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {buildings.map(el => 
                            <Marker onClick={() => setBuilding(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL>  

                    {need === null ? 
                            <>
                                <h2>Новое Предложение</h2>
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                                <h4 className='pale'>Тип</h4>
                                <div className='items small'>
                                    {NEED_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>   

                                <h4 className='pale'>Стоимость</h4>
                                <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} placeholder='Стоимость' type='text' />

                                {isNaN(cost) ? 
                                        <button onClick={() => setState({...state, cost: DEFAULT_NEED_COST})}>Сбросить</button>
                                    :
                                        <button onClick={() => onManageNeed('create')}>Опубликовать</button>
                                }

                                <DataPagination initialItems={area.needs} setItems={setNeeds} label='Список предложений:' />
                                <div className='items half'>
                                    {needs.map(el => 
                                        <div onClick={() => setNeed(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <h5 className='pale'>{el.category}</h5>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setNeed(null)} />

                                <h2>{need.text}</h2>

                                <div className='items small'>
                                    <h4>Стоимость: <b>{need.cost}₽</b></h4>
                                    <h4>Рейтинг: <b>{need.supports}</b></h4>
                                </div>

                                {context.username === need.name ? 
                                        <button onClick={() => onManageNeed('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageNeed('support')}>Поддержать</button>
                                }
                            </>
                    }
                </>
            }
            {area === null && <Loading />}
        </>
    )
}

export default Area