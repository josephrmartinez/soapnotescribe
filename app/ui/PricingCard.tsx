interface PricingCardProps {
  plan: string;
  price: string;
  featureOne: string;
  featureTwo: string;
  featureThree: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  featureOne,
  featureTwo,
  featureThree,
}) => {
  return (
    <div className="flex w-[32rem] flex-col justify-center gap-6 rounded-lg border bg-transparent px-10 py-10 shadow-md">
      <div className="flex flex-row items-center justify-between">
        <p
          className={`text-3xl font-semibold uppercase tracking-wide text-teal-700`}
        >
          {plan}
        </p>
        <p className="text-3xl font-bold tracking-wide text-gray-700">
          ${price} / mo
        </p>
      </div>

      <p className="text-md tracking-wide text-gray-600">- {featureOne}</p>
      <p className="text-md tracking-wide text-gray-600">- {featureTwo}</p>
      <p className="text-md tracking-wide text-gray-600">- {featureThree}</p>
      <button className="mx-auto mt-2 w-32 rounded-full bg-teal-600 py-3 font-bold text-white hover:bg-teal-500 hover:text-white">
        get started
      </button>
    </div>
  );
};
export { PricingCard };
