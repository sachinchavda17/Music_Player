import { Icon } from "@iconify/react"


const Loading = ({fullScreen}) => {
  return (
    <div className={` ${fullScreen ? "top-0 left-0 bottom-0 right-0 z-50 bg-darkGray-light bg-opacity-3 w-screen h-screen":""} flex justify-center  items-center  py-20 mx-auto h-full `} >
        {/* <div className="text-white text-xl">Loading...</div> */}
      <Icon icon="eos-icons:three-dots-loading" color="#eee" width="150" height="150" />
    </div>
  )
}

export default Loading
