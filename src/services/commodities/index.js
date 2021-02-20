import Station from '../../models/Station'
import LocalStorageStrategy from '../../storage/localStorage'

const STATIONS_ARRAY_KEY = "stations_array_key"

export default class CommoditiesService {
    
    constructor() {

        this.strategy = new LocalStorageStrategy()
    }

    queryStationData(station) {
        if (!(station instanceof Station)) {
            throw Error('Not a Station')
        }

        const { system, name } = station

        return fetch(`https://alana.netlify.app/.netlify/functions/scrape?system=${system}&station=${name}`)
        .then(response => response.json())
        .then(json => json)
    }

    addStation(station) {

        if (!(station instanceof Station)) {
            throw Error('Not a Station')
        }

        const stations = this.strategy.read(STATIONS_ARRAY_KEY)

        const data = Array.isArray(stations) ? stations : []

        data.push(station)

        this.strategy.update(STATIONS_ARRAY_KEY, data)
    }

    removeStation(station) {

        if (!(station instanceof Station)) {
            throw Error('Not a Station')
        }

        const stations = this.strategy.read(STATIONS_ARRAY_KEY)

        console.log('test : ', stations)

        if (!Array.isArray(stations)) {
            console.warn('stations is not array')
            return
        }

        const data = stations.filter(s => {
            const result = s.name === station.name && s.system === station.system

            return !result
        })

        this.strategy.update(STATIONS_ARRAY_KEY, data)
    }
    
    getStations() {
        const stations = this.strategy.read(STATIONS_ARRAY_KEY)

        if (Array.isArray(stations)) {
            return stations.map(station => {

                return new Station(station.system, station.name)
            })
        } else {
            return []
        }
    }
}