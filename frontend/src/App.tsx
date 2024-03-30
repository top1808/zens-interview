import Logo from './assets/logo.png'
import Avt from './assets/avt.jpeg'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

interface Joke {
  _id: string
  content: string
  funnyRate: number
  notFunnyRate: number
}

function App() {
  const [joke, setJoke] = useState<Joke | null>(null)

  const fetchJokes = useCallback(async () => {
    const jokesRated = localStorage?.getItem('jokesRated') ? JSON.parse(localStorage?.getItem('jokesRated') || '') : []

    const jokes = await getJokes()

    const joke = jokes.filter((item: Joke) => !jokesRated.some((id: string) => id === item._id))[0]

    setJoke(joke || null)
  }, [])

  const getJokes = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/get-jokes')
      return res.data?.jokes
    } catch (e) {
      console.log('error: ', e)
    }
  }

  const rateJoke = async (id: string, type: string) => {
    try {
      const res = await axios.patch(import.meta.env.VITE_API_URL + `/${id}/rate-joke`, { type })
      let jokesRated = localStorage?.getItem('jokesRated') ? JSON.parse(localStorage?.getItem('jokesRated') || '') : []
      jokesRated = [...jokesRated, id]
      localStorage.setItem('jokesRated', JSON.stringify(jokesRated))
      fetchJokes()
      return res.data?.message
    } catch (e) {
      console.log('error: ', e)
    }
  }

  useEffect(() => {
    fetchJokes()
  }, [fetchJokes])

  return (
    <>
      <header className='bg-white flex justify-between items-center shadow-lg p-2 xl:px-40'>
        <img src={Logo} alt='logo' className='w-28' />
        <div className='flex items-center gap-4'>
          <div className='text-end'>
            <div className='text-gray-500 font-medium'>Handicrafted by</div>
            <div className='font-medium'>Jim HLS</div>
          </div>
          <img src={Avt} alt='avt' className='w-16 h-16 rounded-full' />
        </div>
      </header>
      <div className='banner text-white py-10 xl:p-20 text-center'>
        <h1 className='text-4xl font-semibold mb-4'>A joke a day keeps the doctor away</h1>
        <p className='font-semibold'>If you joke wrong way, your teeth have to pay. (Serious)</p>
      </div>
      <div className='w-full xl:w-2/3 mx-auto'>
        {joke ? (
          <>
            <div className='px-8 py-16 xl:p-16 text-gray-600 font-medium'>{joke.content}</div>
            <div className='p-16 border-t border-gray-200 flex items-center gap-12 justify-center'>
              <button className='btn btn-funny' onClick={() => rateJoke(joke._id, 'funny')}>
                This is funny!
              </button>
              <button className='btn btn-not_funny' onClick={() => rateJoke(joke._id, 'notFunny')}>
                This is not funny!
              </button>
            </div>
          </>
        ) : (
          <div className='p-16 text-gray-600 font-medium text-center'>
            "That's all the jokes for today! Come back another day!"
          </div>
        )}
      </div>
      <footer className='bg-white text-center border-t border-gray-300 p-12 px-4 xl:px-40'>
        <div className='text-gray-500 font-medium'>
          This website is created as part of Hlsolutions program. The materials contained on this website are provided
          for general information only and do not constitute any form of advice. HLS assumes no responsibility for the
          accuracy of any particular statement and accepts no liability for any loss or damage which may arise from
          reliance on thi information contained on this site.
        </div>
        <div className='font-medium mt-4 text-gray-600'>Copyright 2021 HLS</div>
      </footer>
    </>
  )
}

export default App
