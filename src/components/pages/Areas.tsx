import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {AREA_TYPES, SEARCH_PERCENT, VIEW_CONFIG, token, change_window_title} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import {getAreasQ} from '../../graphql/pages/AreaPageQueries'
import {TownType, Cords} from '../../types/types'

const Areas: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(AREA_TYPES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [areas, setAreas] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getAreasQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setAreas(data.getAreas)

            change_window_title('Участки')
        }
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (areas !== null) {
            let result: any[] = areas.filter(el => el.region === region)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category)

            setFiltered(result)
        }
    }, [areas, title, category, region])

    return (
        <>          
            <h2>Поиск участка</h2>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Название</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Введите название' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Ближайший город' type='text' />
                </div>
            </div>

            <h4 className='pale'>Категория</h4>
            <div className='items small'>
                {AREA_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Карта участков:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper url={`/area/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL>  
            }
            
            {loading && <Loading />}
        </>
    )
}

export default Areas