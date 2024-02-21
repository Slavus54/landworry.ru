import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import {Datus, time_format_min_border, time_format_max_border} from 'datus.js'
import CounterView from '../UI/CounterView'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfileCommonInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const CommonProfileInfo = ({profile, context}: AccountPageComponentProps) => {
    const datus = new Datus()
    
    const [timer, setTimer] = useState<number>(datus.time(profile.timestamp, 'deconvert'))
    const [state, setState] = useState({
        timestamp: profile.timestamp, 
        radius: profile.radius
    })

    const {timestamp, radius} = state    

    const [updateProfileCommonInfo] = useMutation(updateProfileCommonInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProfileCommonInfo)
        }
    })

    useMemo(() => {
        setState({...state, timestamp: datus.time(timer)})
    }, [timer])

    const onUpdate = () => {
        updateProfileCommonInfo({
            variables: {
                account_id: context.account_id, timestamp, radius
            }
        })
    }

    return (
        <>
            <CounterView num={timer} setNum={setTimer} part={30} min={time_format_min_border} max={time_format_max_border}>
                Начало работы в {timestamp}
            </CounterView>

            <h4 className='pale'>Радиус предоставляемых услуг: <b>{radius}</b> км</h4>
            <input value={radius} onChange={e => setState({...state, radius: parseInt(e.target.value)})} type='range' step={1} />

            <button onClick={onUpdate}>Обновить</button>
        </> 
    )
}

export default CommonProfileInfo