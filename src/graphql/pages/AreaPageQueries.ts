import {gql} from '@apollo/client'

export const createAreaM = gql`
    mutation createArea($username: String!, $id: String!, $title: String!, $category: String!, $format: String!, $region: String!, $cords: ICord!, $rating: Float!, $image: String!) {
        createArea(username: $username, id: $id, title: $title, category: $category, format: $format, region: $region, cords: $cords, rating: $rating, image: $image)
    }
`

export const getAreasQ = gql`
    query {
        getAreas {
            shortid
            username
            title
            category
            format
            region
            cords {
                lat
                long
            }
            rating
            needs {
                shortid
                name
                text
                category
                cost
                supports
            }
            buildings {
                shortid
                name
                title
                architecture
                cords {
                    lat
                    long
                }
                photo
            }
        }
    }
`

export const getAreaM = gql`
    mutation getArea($shortid: String!) {
        getArea(shortid: $shortid) {
            shortid
            username
            title
            category
            format
            region
            cords {
                lat
                long
            }
            rating
            needs {
                shortid
                name
                text
                category
                cost
                supports
            }
            buildings {
                shortid
                name
                title
                architecture
                cords {
                    lat
                    long
                }
                photo
            }
        }
    }
`

export const updateAreaInfoM = gql`
    mutation updateAreaInfo($username: String!, $id: String!, $rating: Float!) {
        updateAreaInfo(username: $username, id: $id, rating: $rating)
    }
`

export const makeAreaBuildingM = gql`
    mutation makeAreaBuilding($username: String!, $id: String!, $title: String!, $architecture: String!, $cords: ICord!, $photo: String!) {
        makeAreaBuilding(username: $username, id: $id, title: $title, architecture: $architecture, cords: $cords, photo: $photo)
    }
`

export const manageAreaNeedM = gql`
    mutation manageAreaNeed($username: String!, $id: String!, $option: String!, $text: String!, $category: String!, $cost: Float!, $coll_id: String!) {
        manageAreaNeed(username: $username, id: $id, option: $option, text: $text, category: $category, cost: $cost, coll_id: $coll_id)
    }
`