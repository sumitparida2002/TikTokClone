import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GoVerified } from 'react-icons/go'
import axios from 'axios'

import VideoCard from '../../components/VideoCard'
import NoResults from '../../components/NoResults'
import { IUser,Video } from '../../types'
import { BASE_URL } from '../../utils/utils'
import { userCreatedPostsQuery } from '../../utils/utils/queries'
import useAuthStore from '../../store/authStore'

const Search = ({videos}:{videos:Video[]}) => {

    const [isAccounts,setIsAccounts]=useState(false)
    const router=useRouter();
    const {searchTerm}:any=router.query
    const {allUsers}=useAuthStore()

    const accounts=isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
    const isVideos=!isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
    const searchedAccounts = allUsers?.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm));

  return (
    <div className='w-full'>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
            <p className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`} onClick={()=>setIsAccounts(true)}>Accounts</p>
            <p className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`} onClick={()=>setIsAccounts(false)}>Videos</p>
        </div>
        {isAccounts ? (
            <div className='md:mt-16 '>
                {searchedAccounts.length >0 ? (
                    searchedAccounts.map((user:IUser,idx:number)=>(
                        <Link href={`/profile/${user._id}`} key={idx}>
                        <div className='flex p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200 gap-3'>
                          <div>
                            <Image
                              width={50}
                              height={50}
                              className='rounded-full cursor-pointer'
                              src={user.image}
                              alt='user-profile' />
                          </div>

                          <p className='flex cursor-pointer gap-1 items-center text-[18px] font-bold leading-6 text-primary'>
                            {user.userName}{' '}
                            <GoVerified className='text-blue-400' />
                          </p>
                        </div>
                      </Link>
                    ))
                ): <NoResults text={`No Account results for ${searchTerm}`} />}
            </div>
        ) : (
            <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
                {videos.length ? (
                    videos.map((video:Video,idx)=>(
                        <VideoCard post={video} key={idx} />
                    ))
                ) : <NoResults text={`No Video results from ${searchTerm}`} /> }
            </div>
        )}
    </div>
  )
}

export const getServerSideProps=async({params:{searchTerm}}:{params:{searchTerm:string}})=>{
    const res =await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

    return{
        props:{
            videos:res.data
        }
    }
    
}

export default Search