import React, {useState, useMemo} from 'react'
import {Route} from 'wouter'
import RouterItem from './RouterItem'
import {routes} from './routes'
import {ContextPropsType, RouteType} from '../../types/types'

const Router: React.FC<ContextPropsType> = ({account_id}) => {
    const [filteredRoutes, setFilteredRoutes] = useState<RouteType[]>(routes)
    const [filteredPages, setFilteredPages] = useState<RouteType[]>(routes)

    useMemo(() => {
        let result = routes.filter(el => account_id.length === 0 ? el.access_value < 1 : el.access_value > -1)

        setFilteredRoutes(result.filter(el => el.isVisible))
        setFilteredPages(result)
    }, [account_id])

    return (
        <>
            <div className='navbar'>
                {filteredRoutes.map(el => <RouterItem title={el.title} url={el.url} />)}
            </div>

            {filteredPages.map(el => <Route component={el.component} path={el.url} />)} 
        </>
    )
}

export default Router