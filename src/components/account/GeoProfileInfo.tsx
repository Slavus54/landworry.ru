import {useState, useMemo, useEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import MapPicker from '../UI/MapPicker'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfileGeoInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps, Cords, TownType} from '../../types/types'

const GeoProfileInfo = ({profile, context} : AccountPageComponentProps) => {
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [cords, setCords] = useState<Cords>({lat: profile.cords.lat, long: profile.cords.long})
    const [state, setState] = useState({
        region: profile.region
    })

    const centum = new Centum()
    const {region} = state

    const [updateProfileGeoInfo] = useMutation(updateProfileGeoInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProfileGeoInfo)   
        }
    })

    useEffect(() => {
        if (region !== '' && region !== profile.region) {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setState({...state, region: result.title})
                setCords(result.cords)
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    const onUpdate = () => {
        updateProfileGeoInfo({
            variables: {
                account_id: context.account_id, region, cords
            }
        })
    }
 
    return (
        <>         
            <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
            
            <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                <Marker latitude={cords.lat} longitude={cords.long}>
                    <MapPicker type='picker' />
                </Marker>
            </ReactMapGL>      

            <button onClick={onUpdate}>Обновить</button>
        </> 
    )
}

export default GeoProfileInfo