import React, { useState, useEffect } from 'react'

import { CommoditiesService } from '../services'
import { Station } from '../models'

const commoditiesService = new CommoditiesService()

const Commodities = () => {

  const [stations, setStations] = useState(getStations())
  const [selectedStation, setSelectedStation] = useState()
  const [commodities, setCommodities] = useState()

  useEffect(() => {
    console.info('Stations: ', stations)
  }, [stations])

  useEffect(() => {
    console.info('Selected: ', selectedStation)
  }, [selectedStation])

  function refreshStations() {
    const stations = getStations()

    setStations(stations)
  }

  function getStations() {
    return commoditiesService.getStations()
  }

  function addStation(systemName, stationName) {
    const station = new Station(systemName, stationName)

    commoditiesService.addStation(station)

    refreshStations()
  }

  function handleAddStation(event) {
    event.preventDefault()

    const systemName = event.target.elements.system.value
    const stationName = event.target.elements.station.value

    addStation(systemName, stationName)
  }

  function handleSelectStation(event) {
    const json = event.target.value

    const station = Station.fromJson(json)

    setSelectedStation(station)

    commoditiesService.queryStationData(station)
      .then(data => {

        console.info('Commodities Data: ', data)

        setCommodities(data)
      })
  }

  function handleRemoveStation() {

    const selected = JSON.parse(selectedStation)

    const station = new Station(selected.system, selected.name)

    commoditiesService.removeStation(station)

    refreshStations()

    setSelectedStation("")
  }

  return (
    <div>
      <h1>Select Station</h1>
      <br />
      <select
        name="stations"
        value={selectedStation}
        onChange={e => handleSelectStation(e)}
      >
        <option key="null" value={""}></option>
        {
          stations.map((station, index) => {
            return (
              <option key={station.name + index} value={station}>{station.system}, {station.name}</option>
            )
          })
        }
      </select>
      <br />
      <br />
      <button
        disabled={!selectedStation || selectedStation.length === 0}
        onClick={handleRemoveStation}>
        Delete
      </button>
      <br />
      <br />
      <form onSubmit={handleAddStation}>
        <label>
          System Name
          <br />
          <input type="text" name="system" />
        </label>
        <br />
        <label>
          Station Name
          <br />
          <input type="text" name="station" />
        </label>
        <br />
        <input type="submit" value="Add Station" style={{ marginTop: 24 }} />
      </form>
      <br />
      <h1>Station Data</h1>
      <br />
      {
        commodities && (commodities.errors === undefined ? commodities.map(commodity => {

          return (
            <div>
              <p>{commodity}</p>
            </div>
          )
        }) : 'Errors: ' + commodities.errors)
      }
      <br />
      <br />
    </div>
  )
}

export default Commodities