import { useRouter } from "next/router";


const VideoCallLobby = () => {
    const router = useRouter();
    const { username, time, amount } = router.query;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // You can add some feedback here, like showing a tooltip or changing the button text to "Copied!"
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-md w-96 mx-auto mt-10">
            <div className="mb-4">
                <p className="text-gray-600">Especialista:</p>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{username}</span>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-600">Tiempo de la consulta:</p>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{time}</span>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-600">Monto a abonar:</p>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{amount}</span>
                </div>
            </div>

            <div className="mb-4 mt-2">
                <p className="text-gray-600">Link de pago</p>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>$$$$</span>
                    <button onClick={() => handleCopy("$$$" as string)} className="text-blue-500 hover:text-blue-600">
                        Copiar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCallLobby