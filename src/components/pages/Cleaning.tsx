import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {SUBJECTS, RESULT_TYPES, INITIAL_PERCENT, TRASH_VOLUME_LIMIT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import CleaningCommonInfo from '../pieces/CleaningCommonInfo'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {getCleaningM, updateCleaningInfoM, makeCleaningResultM, manageCleaningStatusM} from '../../graphql/pages/CleaningPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Cleaning: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [image, setImage] = useState<string>('')
    const [cleaning, setCleaning] = useState<any | null>(null)
    const [results, setResults] = useState<any[]>([])
    const [result, setResult] = useState<any | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [personality, setPersonality] = useState<any | null>(null)
    const [state, setState] = useState({
        subject: SUBJECTS[0],
        discussion: '',
        text: '',
        category: RESULT_TYPES[0],
        volume: 0
    })

    const centum = new Centum()

    const {subject, discussion, text, category, volume} = state

    const [getCleaning] = useMutation(getCleaningM, {
        optimisticResponse: true,
        onCompleted(data) {
            setCleaning(data.getCleaning)
        }
    })

    const [updateCleaningInfo] = useMutation(updateCleaningInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateCleaningInfo)
        }
    })

    const [makeCleaningResult] = useMutation(makeCleaningResultM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.makeCleaningResult)
        }
    })

    const [manageCleaningStatus] = useMutation(manageCleaningStatusM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageCleaningStatus)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getCleaning({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (cleaning !== null) {
            let member = cleaning.members.find(el => centum.search(el.account_id, context.account_id, SEARCH_PERCENT))

            if (member !== undefined) {
                setPersonality(member)
            }

            setCords(cleaning.cords)          
        }
    }, [cleaning])

    useMemo(() => {
        if (cleaning !== null && personality !== null) {
            setState({...state, discussion: cleaning.discussion, subject: personality.subject})         
        }
    }, [personality])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (cleaning !== null) {
            setState({...state, volume: centum.part(percent, TRASH_VOLUME_LIMIT, 0)})         
        }
    }, [percent])

    const onUpdateInfo = () => {
        updateCleaningInfo({
            variables: {
                username: context.username, id, discussion
            }
        })
    }

    const onMakeResult = () => {
        makeCleaningResult({
            variables: {
                username: context.username, id, text, category, volume, image
            }
        })
    }

    const onManageStatus = (option: string) => {
        manageCleaningStatus({
            variables: {
                username: context.username, id, option, subject
            }
        })
    }

    return (
        <>          
            {cleaning !== null && personality === null && 
                <>
                    <h2>Добро пожаловать!</h2>

                    <CleaningCommonInfo dateUp={cleaning.dateUp} time={cleaning.time} />

                    <h4 className='pale'>Область ответственности</h4>
                    <select value={subject} onChange={e => setState({...state, subject: e.target.value})}>
                        {SUBJECTS.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('join')}>Присоединиться</button>
                </>
            }

            {cleaning !== null && personality !== null && 
                <>
                    <h2>{cleaning.title}</h2>

                    <CleaningCommonInfo dateUp={cleaning.dateUp} time={cleaning.time} />

                    <div className='items half'>
                        <div className='item'>
                            <h4 className='pale'>Тема для дискуссии</h4>
                            <textarea value={discussion} onChange={e => setState({...state, discussion: e.target.value})} placeholder='Ваш текст...' />
                            <button onClick={onUpdateInfo}>Предложить</button>
                        </div>
                        <div className='item'>
                            <h4 className='pale'>Область ответственности</h4>
                            <select value={subject} onChange={e => setState({...state, subject: e.target.value})}>
                                {SUBJECTS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <button onClick={() => onManageStatus('update')}>Обновить</button>
                        </div>
                    </div>

                    <button onClick={() => onManageStatus('exit')} className='light-btn'>Выйти</button>

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cleaning.cords.lat} longitude={cleaning.cords.long}>
                            <MapPicker type='home' />
                        </Marker>
                        
                        {cleaning.dots.map(el => 
                            <Marker latitude={el.lat} longitude={el.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        )}
                    </ReactMapGL>  

                    {result === null ? 
                            <>
                                <h2>Что удалось собрать?</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                                <h4 className='pale'>Тип</h4>
                                <div className='items small'>
                                    {RESULT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>  

                                <h4 className='pale'>Объём: <b>{volume}</b> литров</h4>
                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                                <ImageLoader setImage={setImage} />

                                <button onClick={onMakeResult}>Опубликовать</button>

                                <DataPagination initialItems={cleaning.results} setItems={setResults} label='Результаты чистки:' />
                                <div className='items half'>
                                    {results.map(el => 
                                        <div onClick={() => setResult(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <b>{el.volume} литров</b>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setResult(null)} />

                                {result.image !== '' && <ImageLook src={result.image} min={16} max={16} className='photo_item' alt='result image' />}

                                <h2>{result.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {result.category}</h4>
                                    <h4 className='pale'>Объём: <b>{result.volume}</b> литров</h4>
                                </div>
                            </>
                    }

                    <DataPagination initialItems={cleaning.members} setItems={setMembers} label='Список участников:' />
                    <div className='items half'>
                        {members.map(el => 
                            <div className='item card'>
                                <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                    {centum.shorter(el.username)}
                                    <h5 className='pale'>{el.subject}</h5>
                                </NavigatorWrapper>
                            </div>    
                        )}
                    </div>
                </>
            }
            
            {personality === null && <Loading />}
        </>
    )
}

export default Cleaning