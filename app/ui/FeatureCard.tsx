interface FeatureCardProps {
  heading: string,
  subheading: string,
  text: string,
  icon: React.ReactNode
}

const FeatureCard:React.FC<FeatureCardProps> = ({heading, subheading, text, icon}) => {
    return (
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-10 md:w-1/3 md:px-20 shadow-md">
          <div className="flex flex-row">
            <div className="w-6 mr-4 text-teal-700">{icon}</div>
            <p className={`text-md text-gray-500 font-semibold uppercase md:leading-normal`}>
              {heading}
            </p>

          </div>
          
          
          <p className='text-lg tracking-wide text-gray-700 font-semibold'>{subheading}</p>
          <p className='text-gray-500 text-md tracking-wide'>{text}</p>
        </div>
    )
}
export { FeatureCard }