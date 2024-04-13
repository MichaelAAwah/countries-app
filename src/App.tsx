import React, { KeyboardEvent, useEffect, useState } from 'react'
import { MdSearch } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";

const countriesApi = import.meta.env.VITE_COUNTRIES_API

interface Country {
  region: string,
  capital: string[],
  population: number,
  name: {
    common: string,
    official: string,
    nativeName: {}
  },
  flags: {
    alt: string,
    png: string,
    svg: string,
  }
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [countriesList, setCountriesList] = useState<Country[]>([])
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  let countries = region ? countriesList.filter(country => country.region.toLowerCase().includes(region.toLowerCase())) : [...countriesList]
  countries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    setLoading(true)
    fetch(countriesApi+'all?fields=name,population,region,capital,flags')
    .then(res => res.json())
    .then((data: Country[]) => {
      setLoading(false)
      setCountriesList(data.sort((a, b) => a.name.common.localeCompare(b.name.common)))
    })
    .catch(err => {
      setLoading(false)
      console.error(err)
    })
  }, [])

  return (
    <div id='root' className='bg-gray-50'>
      <div>
        <nav className='w-full sticky top-0 shadow-md py-8 px-14'>
          <div className="flex justify-between">
            <h3 className='text-2xl font-bold'>Where in the world?</h3>

            {/* <button className='text-base'>Dark Mode</button> */}
          </div>
        </nav>
      </div>

      <div className="body">
        <div className="flex justify-between py-8 px-14">
          <div className='w-2/4 relative'>
            <input type="text" placeholder='Search for a country' value={search} onChange={(event) => setSearch(event.target.value)} className='w-full ps-14 p-5 shadow-md border border-gray-100' />
            <span className='absolute top-6 left-5'>
              <MdSearch className='text-xl text-gray-400' />
            </span>
          </div>

          <div className="dropdown relative w-1/4 shadow-md border bg-white border-gray-100">
            <button onClick={() => setShowDropdown(!showDropdown)} className='dropdown-toggle relative block w-full h-full text-left p-5'>
              Filter by Region {region && `(${region})`}
              <span className="absolute top-6 right-5">
                <IoChevronDown className='text-base' />
              </span>
            </button>
            <ul className={`absolute ${showDropdown ? 'block' : 'hidden'} py-1 bg-white shadow-md w-full top-20 rounded-lg`}>
              <li onClick={() => {setRegion('');setShowDropdown(false)}} className='py-2 px-4 cursor-pointer hover:bg-gray-200'>All</li>
              <li onClick={() => {setRegion('Africa');setShowDropdown(false)}} className='py-2 px-4 cursor-pointer hover:bg-gray-200'>Africa</li>
              <li onClick={() => {setRegion('Americas');setShowDropdown(false)}} className='py-2 px-4 cursor-pointer hover:bg-gray-200'>America</li>
              <li onClick={() => {setRegion('Asia');setShowDropdown(false)}} className='py-2 px-4 cursor-pointer hover:bg-gray-200'>Asia</li>
              <li onClick={() => {setRegion('Europe');setShowDropdown(false)}} className='py-2 px-4 cursor-pointer hover:bg-gray-200'>Europe</li>
              <li onClick={() => {setRegion('Oceania');setShowDropdown(false)}} className='py-2 px-4 cursor-pointer hover:bg-gray-200'>Oceania</li>
            </ul>
          </div>
        </div>

        {loading && 
          <div className="py-8 px-14">
            <h3 className='text-2xl'>Loading...</h3>
          </div>
        }

        {!loading && 
          <div className="grid grid-cols-4 gap-10 py-8 px-14">
            {countries.map((country, idx) => (
              <CountryCard key={idx} country={country} />
            ))}
          </div>
        }
      </div>
    </div>
  )
}

interface CountryCardProps {
  country: Country
}

function CountryCard({ country }: CountryCardProps) {
  const name = country.name.common
  const population = formatNumberWithCommas(country.population)
  const region = country.region
  const capital = country.capital
  const flag = country.flags

  function formatNumberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="card cursor-pointer bg-white shadow-md hover:shadow-lg rounded-lg">
      <div className="w-full h-40">
        <img src={flag.png} alt={flag.alt} width={'100%'} height={'100%'} className='w-full h-full' />
      </div>
      <div className="p-4">
        <h5 className="text-xl mb-2">{name}</h5>

        <span className='block text-base'>
          <span className="font-bold">Population: </span>
          <span className="font-normal">{population}</span>
        </span>

        <span className='block text-base'>
          <span className="font-bold">Region: </span>
          <span className="font-normal">{region}</span>
        </span>

        <span className='block text-base'>
          <span className="font-bold">Capital: </span>
          <span className="font-normal">{capital}</span>
        </span>
      </div>
    </div>
  )
}
