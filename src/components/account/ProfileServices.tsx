import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {SERVICE_TYPES, LEVELS, DEFAULT_COST} from '../../env/env'
import DataPagination from '../UI/DataPagination'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import {ModernAlert} from '../UI/ModernAlert'
import {manageProfileServiceM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileServices = ({profile, context}: AccountPageComponentProps) => {
    const [services, setServices] = useState<any[]>([])
    const [service, setService] = useState<any | null>(null)
    const [image, setImage] = useState<string>('')
    const [state, setState] = useState({
        title: '', 
        category: SERVICE_TYPES[0], 
        level: LEVELS[0], 
        cost: DEFAULT_COST
    })

    const centum = new Centum()

    const {title, category, level, cost} = state    

    const [manageProfileService] = useMutation(manageProfileServiceM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageProfileService)
        }
    })

    useMemo(() => {
        setState({...state, level: service === null ? LEVELS[0] : service.level})
        setImage(service === null ? '' : service.image)
    }, [service])

    const onManageService = (option: string) => {
        manageProfileService({
            variables: {
                account_id: context.account_id, option, title, category, level, cost, image, coll_id: service === null ? '' : service.shortid
            }
        })
    }

    return (
        <>
            {service === null ? 
                    <>
                        <h2>Добавьте услугу</h2>

                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />

                        <h4 className='pale'>Ставка в час (₽)</h4>
                        <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} placeholder='Цена за час' type='text' />

                        <div className='items small'>
                            {SERVICE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Нагруженность</h4>
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ImageLoader setImage={setImage} />

                        {isNaN(cost) ? 
                                <button onClick={() => setState({...state, cost: DEFAULT_COST})} className='light-btn'>Сбросить</button> 
                            : 
                                <button onClick={() => onManageService('create')}>Создать</button>
                        }
                    
                        <DataPagination initialItems={profile.services} setItems={setServices} label='Мои услуги:' />
                        <div className='items half'>
                            {services.map(el => 
                                <div onClick={() => setService(el)} className='item panel'>
                                    {centum.shorter(el.title)}
                                    <div className='items small'>
                                        <h5 className='pale'>{el.category}</h5>
                                        <h5 className='pale'><b>{el.likes}</b> likes</h5>
                                    </div>
                                </div>    
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setService(null)} />

                        <ImageLook src={image} className='photo_item' alt='service photo' />
                    
                        <h2>{service.title}</h2>

                        <div className='items small'>
                            <h4 className='pale'>Тип: {service.category}</h4>
                            <h4 className='pale'>Ставка: <b>{service.cost}₽</b>/час</h4>
                        </div>

                        <h4 className='pale'>Нагруженность</h4>
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ImageLoader setImage={setImage} />

                        <div className='items small'>
                            <button onClick={() => onManageService('delete')}>Удалить</button>
                            <button onClick={() => onManageService('update')}>Обновить</button>
                        </div>
                    </>
            }
        </> 
    )
}

export default ProfileServices