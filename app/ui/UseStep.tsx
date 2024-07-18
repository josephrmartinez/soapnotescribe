interface UseStepProps {
  step: string;
  subtext: string;
  icon: React.ReactNode;
}

const UseStep: React.FC<UseStepProps> = ({ step, subtext, icon }) => {
  return (
    <div className="grid grid-rows-3 gap-2 rounded-md border bg-white/50 p-6">
      <div className=" row-span-1 flex flex-row items-center">
        <div className="mr-4 w-6 text-teal-700">{icon}</div>
        <p className={`text-2xl font-semibold tracking-wide text-teal-700`}>
          {step}
        </p>
      </div>

      <p className="text-md row-span-2 tracking-wide text-gray-800">
        {subtext}
      </p>
    </div>
  );
};
export { UseStep };
