import { QuestionMarkIcon } from '@/components/Icons';


const Tooltip = ({ text, color = 'text-gray-800' }) => {
    return (
        <div className="relative cursor-pointer inline-block ml-1 group">
            <QuestionMarkIcon className={`w-5 h-5 ${color}`} />
            <span className="absolute text-xs bg-gray-800 text-white rounded z-30 rounded rounded-md bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 p-4 w-72 transition ease-in-out duration-300 hidden group-hover:block">
                {text}
            </span>
        </div>
    )
}

export default Tooltip