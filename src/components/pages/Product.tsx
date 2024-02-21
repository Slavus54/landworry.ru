import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
//@ts-ignore
import {Datus} from 'datus.js'
import {PRODUCT_STATUSES, CRITERIONS, PRODUCT_INITIAL_COST, INITIAL_PERCENT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import MapPicker from '../UI/MapPicker'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {getProductM, updateProductInfoM, makeProductReviewM, manageProductOfferM} from '../../graphql/pages/ProductPageQueries'
import {CollectionPropsType, TownType, Cords} from '../../types/types'

const Product: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [image, setImage] = useState<string>('')
    const [product, setProduct] = useState<any | null>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [review, setReview] = useState<any | null>(null)
    const [offers, setOffers] = useState<any[]>([])
    const [offer, setOffer] = useState<any | null>(null)

    const datus = new Datus()

    const [state, setState] = useState({
        status: PRODUCT_STATUSES[0],
        text: '',
        criterion: CRITERIONS[0],
        rating: INITIAL_PERCENT,
        dateUp: datus.move(),
        marketplace: '',
        cost: PRODUCT_INITIAL_COST
    })

    const centum = new Centum()

    const {status, text, criterion, rating, dateUp, marketplace, cost} = state

    const [getProduct] = useMutation(getProductM, {
        optimisticResponse: true,
        onCompleted(data) {
            setProduct(data.getProduct)
        }  
    })

    const [updateProductInfo] = useMutation(updateProductInfoM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.updateProductInfo)
        }  
    })

    const [makeProductReview] = useMutation(makeProductReviewM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.makeProductReview)
        }  
    })

    const [manageProductOffer] = useMutation(manageProductOfferM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.manageProductOffer)
        }  
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getProduct({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (product !== null) {
            setImage(product.image)

            setState({...state, status: product.status})
        }
    }, [product])

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

    const onUpdateInfo = () => {
        updateProductInfo({
            variables: {
                username: context.username, id, status, image
            }
        })
    }

    const onMakeReview = () => {
        makeProductReview({
            variables: {
                username: context.username, id, text, criterion, rating, dateUp
            }
        })
    }

    const onManageOffer = (option: string) => {
        manageProductOffer({
            variables: {
                username: context.username, id, option, marketplace, cost, cords, coll_id: offer === null ? '' : offer.shortid
            }
        })
    }

    return (
        <>          
            {product !== null &&
                <>
                    {image !== '' && <ImageLook src={image} className='photo_item' alt='product photo' />}
                    <h2>{product.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Тип: {product.category}</h4>
                        <h4 className='pale'>Производитель: {product.country}</h4>
                    </div>

                    <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                        {PRODUCT_STATUSES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <ImageLoader setImage={setImage} />

                    <button onClick={onUpdateInfo} className='light-btn'>Обновить</button>

                    {offer === null ? 
                            <>
                                <h2>Новое Предложение</h2>

                                <input value={marketplace} onChange={e => setState({...state, marketplace: e.target.value})} placeholder='Название магазина' type='text' />

                                <h4>Стоимость (₽) и расположение</h4>

                                <div className='items small'>
                                    <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} placeholder='Стоимость' type='text' />
                                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Ближайший город' type='text' />
                                </div>

                                <button onClick={() => onManageOffer('create')}>Добавить</button>

                                <DataPagination initialItems={product.offers} setItems={setOffers} label='Карта предложений:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setOffer(null)} />

                                <h2>{offer.marketplace}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Стоимость: <b>{offer.cost}</b>₽</h4>
                                    <h4 className='pale'><b>{offer.likes}</b> лайков</h4>
                                </div>

                                {offer.name === context.username ? 
                                        <button onClick={() => onManageOffer('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageOffer('like')}>Нравится</button>
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {offers.map(el => 
                            <Marker onClick={() => setOffer(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.marketplace)}
                            </Marker>
                        )}
                    </ReactMapGL> 

                    {review === null ? 
                            <>
                                <h2>Новый Отзыв</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Ваш текст...' />

                                <h4 className='pale'>Критерий</h4>
                                <div className='items small'>
                                    {CRITERIONS.map(el => <div onClick={() => setState({...state, criterion: el})} className={el === criterion ? 'item label active' : 'item label'}>{el}</div>)}
                                </div> 

                                <h4 className='pale'>Рейтинг: <b>{rating}%</b></h4>
                                <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                                <button onClick={onMakeReview}>Опубликовать</button>

                                <DataPagination initialItems={product.reviews} setItems={setReviews} label='Отзывы:' />
                                <div className='items half'>
                                    {reviews.map(el => 
                                        <div onClick={() => setReview(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <h5>{el.criterion}</h5>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setReview(null)} />

                                <h2>{review.text}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Критерий: {review.criterion}</h4>
                                    <h4 className='pale'>Рейтинг: <b>{review.rating}%</b></h4>
                                </div>
                            </>
                    }
                </>
            }

            {product === null && <Loading />}
        </>
    )
}

export default Product