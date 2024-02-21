import React, {useState, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {PRODUCT_TYPES, PRODUCT_LEVELS, COUNTRIES, PRODUCT_STATUSES} from '../../env/env'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createProductM} from '../../graphql/pages/ProductPageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateProduct: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '', 
        category: PRODUCT_TYPES[0], 
        level: PRODUCT_LEVELS[0], 
        country: COUNTRIES[0], 
        status: PRODUCT_STATUSES[0]
    })

    const {title, category, level, country, status} = state

    const [createProduct] = useMutation(createProductM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createProduct)
        }
    })

    const onCreate = () => {
        createProduct({
            variables: {
                username: context.username, id, title, category, level, country, status, image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Название</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Полное название продукта' />
                
                        <h4 className='pale'>Категория</h4>
                        <div className='items small'>
                            {PRODUCT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>      

                        <ImageLoader setImage={setImage} />               
                    </>,
                    <>
                        <h4 className='pale'>Дополнительная информация</h4>
                        <div className='items small'>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {PRODUCT_LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {PRODUCT_STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div> 

                        <h4 className='pale'>Производитель</h4>
                        <div className='items small'>
                            {COUNTRIES.map(el => <div onClick={() => setState({...state, country: el})} className={el === country ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                    </>
                ]} 
            >
                <h2>Новый Товар</h2>
            </FormPagination>

            <button onClick={onCreate}>Создать</button>
        </div>
    )
}

export default CreateProduct