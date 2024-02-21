import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {PRODUCT_TYPES, SEARCH_PERCENT, change_window_title} from '../../env/env'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import Loading from '../UI/Loading'
import DataPagination from '../UI/DataPagination'
import {getProductsQ} from '../../graphql/pages/ProductPageQueries'

const Products: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(PRODUCT_TYPES[0])
    const [products, setProducts] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getProductsQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setProducts(data.getProducts)

            change_window_title('Товары')
        }
    }, [data])

    useMemo(() => {
        if (products !== null) {
            let result: any[] = products.filter(el => el.category === category)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            setFiltered(result)
        }
    }, [products, title, category])

    return (
        <>          
            <h2>Поиск товара</h2>
       
            <h4 className='pale'>Название</h4>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Введите название' type='text' />

            <h4 className='pale'>Категория</h4>
            <div className='items small'>
                {PRODUCT_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Список товаров:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item card'>
                            <NavigatorWrapper url={`/product/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </div>    
                    )}
                </div>
            }
            
            {loading && <Loading />}
        </>
    )
}

export default Products