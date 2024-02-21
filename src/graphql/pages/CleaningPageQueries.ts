import {gql} from '@apollo/client'

export const createCleaningM = gql`
    mutation createCleaning($username: String!, $id: String!, $title: String!, $category: String!, $level: String!, $dateUp: String!, $time: String!, $region: String!, $cords: ICord!, $dots: [ICord]!, $distance: Float!, $discussion: String!, $subject: String!) {
        createCleaning(username: $username, id: $id, title: $title, category: $category, level: $level, dateUp: $dateUp, time: $time, region: $region, cords: $cords, dots: $dots, distance: $distance, discussion: $discussion, subject: $subject) 
    }
`

export const getCleaningsQ = gql`
    query {
        getCleanings {
            shortid
            username
            title
            category
            level
            dateUp
            time
            region
            cords {
                lat
                long
            }
            dots {
                lat
                long
            }
            distance
            discussion
            members {
                account_id
                username
                subject
            }
            results {
                shortid
                name
                text
                category
                volume
                image
            }
        }
    }
`

export const getCleaningM = gql`
    mutation getCleaning($shortid: String!) {
        getCleaning(shortid: $shortid) {
            shortid
            username
            title
            category
            level
            dateUp
            time
            region
            cords {
                lat
                long
            }
            dots {
                lat
                long
            }
            distance
            discussion
            members {
                account_id
                username
                subject
            }
            results {
                shortid
                name
                text
                category
                volume
                image
            }
        }
    }
`

export const updateCleaningInfoM = gql`
    mutation updateCleaningInfo($username: String!, $id: String!, $discussion: String!) {
        updateCleaningInfo(username: $username, id: $id, discussion: $discussion)
    }
`

export const makeCleaningResultM = gql`
    mutation makeCleaningResult($username: String!, $id: String!, $text: String!, $category: String!, $volume: Float!, $image: String!) {
        makeCleaningResult(username: $username, id: $id, text: $text, category: $category, volume: $volume, image: $image)
    }
`

export const manageCleaningStatusM = gql`
    mutation manageCleaningStatus($username: String!, $id: String!, $option: String!, $subject: String!) {
        manageCleaningStatus(username: $username, id: $id, option: $option, subject: $subject)
    }
`