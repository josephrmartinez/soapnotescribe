export default function FeatureCard({heading, subheading, text}){
    return (
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-10 md:w-1/3 md:px-20">
          <p className={`text-md text-gray-500 font-semibold uppercase md:leading-normal`}>
            {heading}
          </p>
          <p className='text-lg tracking-wide text-gray-700 font-semibold'>{subheading}</p>
          <p className='text-gray-500 text-sm tracking-wide'>{text}</p>
        </div>
    )
}