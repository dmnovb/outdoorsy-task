import {useEffect, useState} from 'react'
import './App.css';

type Car = {
  id: number,
  name: string,
  imageURL: string
}

const App = () => {
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [offset, setOffset] = useState(0)
  const [vehicleType, setVehicleType] = useState('')
  const [isEmpty, setIsEmpty] = useState(true)
 
  useEffect(()=> {
    getData(0)
  }, [])

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setOffset(0)
    getData(0)
  }
 
  const getData = async(offset:number) => {
    var endpointUrl = `https://search.outdoorsy.com/rentals?filter[type]=${vehicleType}&address=usa&page[offset]=${offset}`;
    var returnedVehicles = await fetch(endpointUrl)
                    .then(async(data) => {
                            let dataForVehicles = await data.json()
                            let tempVehicles:Car[] = []; 
                          
                            console.log(dataForVehicles)
                            for(let i = 0; i < dataForVehicles.data.length;i++) {
                              if(!(dataForVehicles.data[i].attributes.primary_image_url.includes(".heic")
                              || dataForVehicles.data[i].attributes.primary_image_url.includes("youtube")|| dataForVehicles.data[i].attributes.primary_image_url.includes("unknown"))) {
                                const car:Car = {
                                  id: dataForVehicles.data[i].attributes.id,
                                  name: dataForVehicles.data[i].attributes.name,
                                  imageURL: dataForVehicles.data[i].attributes.primary_image_url
                                };
                                tempVehicles.push(car);
                              }
                            }
                            
                            return tempVehicles;
    })

    setVehicles(returnedVehicles)
    setIsEmpty(returnedVehicles.length === 0)
  }
  
  return (
    <div>
       <form onSubmit = {handleSubmit}>
        <input
          id="first_name"
          name="first_name"
          type="text"
          onChange={event => setVehicleType(event.target.value)}
         value={vehicleType}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
      {
        vehicles.map(car => (   
          <div className='info-box'>  
            <li key={car.id}>
              <img width="120" height = "120" src={car.imageURL}></img>
              <p>{car.name}</p>
            </li>
          </div>
      ))}
      </ul>
      {!isEmpty && <button className="next-page"onClick={(e) => {
        setOffset(offset + 24)
        getData(offset + 24);
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
        
        }}>Next</button>}
    </div>
  );
}

export default App;
