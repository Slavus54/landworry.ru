import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {AREA_TYPES, PROPERTY_FORMATS, INITIAL_PERCENT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createAreaM} from '../../graphql/pages/AreaPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateArea: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        title: '', 
        category: AREA_TYPES[0], 
        format: PROPERTY_FORMATS[0],
        region: towns[0].title, 
        cords: towns[0].cords,
        rating: INITIAL_PERCENT
    })

    const centum = new Centum()

    const {title, category, format, region, cords, rating} = state

    const [createArea] = useMutation(createAreaM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createArea)
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
    
    const onCreate = () => {
        createArea({
            variables: {
                username: context.username, id, title, category, format, region, cords, rating
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Название</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Что это за место?' />
                
                        <h4 className='pale'>Категория</h4>
                        <div className='items small'>
                            {AREA_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>                     
                    </>,
                    <>
                        <h4 className='pale'>Тип собственности</h4>
                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {PROPERTY_FORMATS.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <h4 className='pale'>Ухоженность: <b>{rating}%</b></h4>
                        <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                    </>,
                    <>
                        <h4 className='pale'>Где это находится?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h2>Новый Участок</h2>
            </FormPagination>

            <button onClick={onCreate}>Создать</button>
        </div>
    )
}

export default CreateArea