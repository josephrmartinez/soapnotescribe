import { poppins } from '@/app/ui/fonts';
import { Button } from './button';


interface PricingCardProps {
  plan: string,
  price: string,
  featureOne: string,
  featureTwo: string,
  featureThree: string
}

const PricingCard:React.FC<PricingCardProps> = ({plan, price, featureOne, featureTwo, featureThree}) => {
    return (
        <div className="flex flex-col justify-center gap-6 rounded-lg border bg-transparent px-10 py-10 shadow-md">
          <div className="flex flex-row items-center justify-between">
            <p className={`text-3xl ${poppins.className} text-teal-700 font-semibold tracking-wide uppercase`}>
              {plan}
            </p>
            <p className='text-3xl tracking-wide text-gray-700 font-bold'>${price}</p>

          </div>
          
          <p className='text-gray-600 text-md tracking-wide'>{featureOne}</p>
          <p className='text-gray-600 text-md tracking-wide'>{featureTwo}</p>
          <p className='text-gray-600 text-md tracking-wide'>{featureThree}</p>
          <Button children={'get started'}/>
        </div>
    )
}
export { PricingCard }