import {gql} from '@apollo/client'

export const createProductM = gql`
    mutation createProduct($username: String!, $id: String!, $title: String!, $category: String!, $level: String!, $country: String!, $status: String!, $image: String!) {
        createProduct(username: $username, id: $id, title: $title, category: $category, level: $level, country: $country, status: $status, image: $image)
    }
`

export const getProductsQ = gql`
    query {
        getProducts {
            shortid
            username
            title
            category
            level
            country
            status
            image 
            reviews {
                shortid
                name
                text
                criterion
                rating 
                dateUp
            }
            offers {
                shortid
                name
                marketplace
                cost
                cords {
                    lat
                    long
                }
                likes
            }
        }
    }
`

export const getProductM = gql`
    mutation getProduct($shortid: String!) {
        getProduct(shortid: $shortid) {
            shortid
            username
            title
            category
            level
            country
            status
            image 
            reviews {
                shortid
                name
                text
                criterion
                rating 
                dateUp
            }
            offers {
                shortid
                name
                marketplace
                cost
                cords {
                    lat
                    long
                }
                likes
            }
        }
    }
`

export const updateProductInfoM = gql`
    mutation updateProductInfo($username: String!, $id: String!, $status: String!, $image: String!) {
        updateProductInfo(username: $username, id: $id, status: $status, image: $image)
    }
`

export const makeProductReviewM = gql`
    mutation makeProductReview($username: String!, $id: String!, $text: String!, $criterion: String!, $rating: Float!, $dateUp: String!) {
        makeProductReview(username: $username, id: $id, text: $text, criterion: $criterion, rating: $rating, dateUp: $dateUp)
    }
`

export const manageProductOfferM = gql`
    mutation manageProductOffer($username: String!, $id: String!, $option: String!, $marketplace: String!, $cost: Float!, $cords: ICord!, $coll_id: String!) {
        manageProductOffer(username: $username, id: $id, option: $option, marketplace: $marketplace, cost: $cost, cords: $cords, coll_id: $coll_id)
    }
`