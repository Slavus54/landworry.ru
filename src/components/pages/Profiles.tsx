import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {INITIAL_PERCENT, SEARCH_PERCENT, VIEW_CONFIG, token, change_window_title} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import {getProfilesQ} from '../../graphql/pages/ProfilePageQueries'
import {TownType, Cords} from '../../types/types'

const Profiles: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [username, setUsername] = useState<string>('')
    const [radius, setRadius] = useState<number>(INITIAL_PERCENT)
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [profiles, setProfiles] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getProfilesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setProfiles(data.getProfiles)

            change_window_title('Пользователи')
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
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (username !== '') {
                result = result.filter(el => centum.search(el.username, username, SEARCH_PERCENT))
            }

            result = result.filter(el => el.radius <= radius)

            setFiltered(result)
        }
    }, [profiles, username, radius, region])

    return (
        <>          
            <h2>Найдите работника или друга</h2>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Имя</h4>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder='Введите имя' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Ближайший город' type='text' />
                </div>
            </div>

            <h4 className='pale'>Радиус предоставляемых услуг: <b>{radius}</b> км</h4>
            <input value={radius} onChange={e => setRadius(parseInt(e.target.value))} type='range' step={1} />

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Карта пользователей:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                {centum.shorter(el.username)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL>  
            }
            {loading && <Loading />}
        </>
    )
}

export default Profiles