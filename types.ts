export type Conference = {
    id: string
    conference_key: string
}

export type Visitor = {
    id: string
    visitor_key: string
}

export type Type = {
    id: string
    name: string
}

export type Resource = {
    id: string
    organizer_id: string
    conference_key: string
    state: string
    name: string
    location: string
    hosts: string
    organizers: string
    sponsors: string
    display_item: string
    homepage: string
    booth_info_link: string
    lecture_info_link: string
    start_time: string
    end_time: string
    origin_deleted: boolean
    origin_deleted_at: string | null
    created_at: string
    updated_at: string
}

export type Event = {
    id: string
    conference_id: string
    visitor_id: string
    user_id: string
    type_id: string
    name: string
    tx_id: string
    is_tx_completed: boolean
    is_hided: boolean
    date: string
    created_at: string
    updated_at: string
    conference: Conference
    visitor: Visitor
    type: Type
    resource: Resource
}
