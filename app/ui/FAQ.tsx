export default function FAQ({question, answer}) {
    return (
        <div className="my-6">       
            <p className="text-gray-700 font-semibold text-2xl mb-2">
                {question}
            </p>

            <p className="text-gray-500 font-medium text-lg">
                {answer}
            </p>
        </div>
    )
}