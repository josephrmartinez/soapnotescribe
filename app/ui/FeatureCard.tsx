interface FeatureCardProps {
  heading: string,
  subheading: string,
  textOne: string,
  textTwo: string,
  icon: React.ReactNode
}

const FeatureCard:React.FC<FeatureCardProps> = ({heading, subheading, textOne, textTwo, icon}) => {
    return (
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-10 py-10 shadow-md">
          <div className="flex flex-row">
            <div className="w-6 mr-4 text-teal-700">{icon}</div>
            <p className={`text-xl text-teal-700 font-bold tracking-wide uppercase md:leading-normal`}>
              {heading}
            </p>

          </div>
          
          
          <p className='text-xl tracking-wide text-gray-700 font-semibold'>{subheading}</p>
          <p className='text-gray-600 text-lg tracking-wide'>{textOne}</p>
          <p className='text-gray-600 text-lg tracking-wide'>{textTwo}</p>
        </div>
    )
}
export { FeatureCard }