interface UseStepProps {
  step: string;
  subtext: string;
  icon: React.ReactNode;
}

const UseStep: React.FC<UseStepProps> = ({ step, subtext, icon }) => {
  return (
    <div className="flex flex-col justify-center gap-6 px-10 py-10">
      <div className="flex flex-row items-center">
        <div className="mr-4 w-6 text-teal-700">{icon}</div>
        <p className={`text-2xl font-semibold tracking-wide text-teal-700`}>
          {step}
        </p>
      </div>

      <p className="text-md tracking-wide text-gray-800">{subtext}</p>
    </div>
  );
};
export { UseStep };
